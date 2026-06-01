import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const browserPath =
  process.env.BROWSER_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.UI_BASE_URL || "http://127.0.0.1:3000";
const debugPort = Number(process.env.CDP_PORT || 9223);
const resultDir = path.resolve("test-results", "ui-smoke");

const routes = [
  { path: "/", expect: "To get started" },
  { path: "/dashboard", expect: "RailTicket" },
  { path: "/login", expect: "USERNAME" },
  { path: "/signup", expect: "Sign Up" },
  { path: "/admin/dashboard", expect: "Dashboard Admin" },
  { path: "/admin/kereta", expect: "Data Kereta" },
  { path: "/admin/jadwal", expect: "Jadwal Kereta" },
  { path: "/admin/users", expect: "Gerbong & Kursi" },
  { path: "/admin/pelanggan", expect: "Data Penumpang" },
  { path: "/admin/pembelian", expect: "Pemesanan" },
  { path: "/admin/payment", expect: "Scan Tiket" },
];

let nextId = 1;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, timeout = 10000) {
  const started = Date.now();
  let lastError;

  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      lastError = error;
    }

    await sleep(250);
  }

  throw lastError || new Error(`Timed out waiting for ${url}`);
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const events = [];

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }

      return;
    }

    events.push(message);
  });

  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      const send = (method, params = {}) => {
        const id = nextId++;
        ws.send(JSON.stringify({ id, method, params }));

        return new Promise((commandResolve, commandReject) => {
          pending.set(id, {
            resolve: commandResolve,
            reject: commandReject,
          });
        });
      };

      resolve({ ws, send, events });
    });
    ws.addEventListener("error", reject);
  });
}

async function waitForEvent(events, predicate, timeout = 12000) {
  const started = Date.now();

  while (Date.now() - started < timeout) {
    const found = events.find(predicate);

    if (found) {
      return found;
    }

    await sleep(100);
  }

  throw new Error("Timed out waiting for browser event");
}

async function waitForExpression(send, expression, timeout = 12000) {
  const started = Date.now();

  while (Date.now() - started < timeout) {
    const value = await evaluate(send, expression);

    if (value) {
      return value;
    }

    await sleep(100);
  }

  throw new Error(`Timed out waiting for expression: ${expression}`);
}

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Evaluation failed");
  }

  return result.result.value;
}

async function typeInto(send, selector, value) {
  await evaluate(
    send,
    `(() => {
      const input = document.querySelector(${JSON.stringify(selector)});
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, ${JSON.stringify(value)});
      input.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: ${JSON.stringify(value)}
      }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return input.value;
    })()`
  );
  await sleep(75);
}

async function typeIntoInputIndex(send, index, value) {
  await evaluate(
    send,
    `(() => {
      const input = document.querySelectorAll('input')[${index}];
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, ${JSON.stringify(value)});
      input.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: ${JSON.stringify(value)}
      }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return input.value;
    })()`
  );
  await sleep(75);
}

async function capture(send, name) {
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  const filePath = path.join(resultDir, `${name}.png`);
  await writeFile(filePath, Buffer.from(screenshot.data, "base64"));
  return filePath;
}

function pageProblems(events) {
  const consoleErrors = events
    .filter(
      (event) =>
        event.method === "Runtime.consoleAPICalled" &&
        event.params.type === "error"
    )
    .map((event) =>
      event.params.args
        .map((arg) => arg.value || arg.description || "")
        .filter(Boolean)
        .join(" ")
    );

  const exceptions = events
    .filter((event) => event.method === "Runtime.exceptionThrown")
    .map((event) => event.params.exceptionDetails.text);

  const failedRequests = events
    .filter((event) => event.method === "Network.loadingFailed")
    .map((event) => event.params.errorText)
    .filter((text) => !text.includes("net::ERR_ABORTED"));

  return [...consoleErrors, ...exceptions, ...failedRequests];
}

async function testRoute(send, events, route, index) {
  events.length = 0;
  await send("Page.navigate", { url: `${baseUrl}${route.path}` });
  await waitForEvent(
    events,
    (event) => event.method === "Page.loadEventFired",
    15000
  );
  await sleep(1500);

  const text = await evaluate(send, "document.body.innerText");
  const title = await evaluate(send, "document.title");
  const problems = pageProblems(events);
  const screenshot = await capture(send, `${String(index + 1).padStart(2, "0")}-${route.path.replaceAll("/", "_") || "home"}`);

  return {
    route: route.path,
    title,
    hasExpectedText: text.includes(route.expect),
    expected: route.expect,
    problems,
    screenshot,
  };
}

async function testLoginInvalid(send, events) {
  events.length = 0;
  await send("Page.navigate", { url: `${baseUrl}/login` });
  await waitForEvent(events, (event) => event.method === "Page.loadEventFired");
  await waitForExpression(
    send,
    "document.querySelector('form')?.dataset.ready === 'true'"
  );
  await typeInto(send, 'input[type="text"]', "invalid-user");
  await typeInto(send, 'input[type="password"]', "invalid-password");
  await sleep(500);
  const beforeSubmit = await evaluate(
    send,
    "Array.from(document.querySelectorAll('input')).map((input) => input.value).join('|')"
  );
  await evaluate(send, "document.querySelector('form').requestSubmit()");
  await sleep(2500);

  const text = await evaluate(send, "document.body.innerText");
  const problems = pageProblems(events);
  const screenshot = await capture(send, "interaction-login-invalid");

  return {
    name: "login-invalid",
    ok:
      text.includes("Unauthorized") ||
      text.includes("User tidak ditemukan") ||
      text.includes("Login gagal") ||
      text.includes("Terjadi kesalahan"),
    beforeSubmit,
    problems,
    screenshot,
  };
}

async function testSignupMismatch(send, events) {
  events.length = 0;
  await send("Page.navigate", { url: `${baseUrl}/signup` });
  await waitForEvent(events, (event) => event.method === "Page.loadEventFired");
  await waitForExpression(
    send,
    "document.querySelector('form')?.dataset.ready === 'true'"
  );
  const values = [
    "tester-ui",
    "Tester UI",
    "1234567890",
    "Jl Test",
    "08123",
    "password1",
    "password2",
  ];

  for (let index = 0; index < values.length; index += 1) {
    await typeIntoInputIndex(send, index, values[index]);
  }

  await sleep(500);
  const beforeSubmit = await evaluate(
    send,
    "Array.from(document.querySelectorAll('input')).map((input) => input.value).join('|')"
  );
  await evaluate(send, "document.querySelector('form').requestSubmit()");
  await sleep(1000);

  const text = await evaluate(send, "document.body.innerText");
  const problems = pageProblems(events);
  const screenshot = await capture(send, "interaction-signup-password-mismatch");

  return {
    name: "signup-password-mismatch",
    ok: text.includes("Konfirmasi password tidak sama."),
    beforeSubmit,
    problems,
    screenshot,
  };
}

async function main() {
  await mkdir(resultDir, { recursive: true });
  const userDataDir = await mkdtemp(path.join(tmpdir(), "railticket-ui-"));
  const browser = spawn(browserPath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--no-first-run",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ]);

  browser.stderr.on("data", () => {});
  browser.stdout.on("data", () => {});

  try {
    const pages = await waitForJson(`http://127.0.0.1:${debugPort}/json`);
    const page = pages.find((item) => item.type === "page") || pages[0];
    const { send, events, ws } = await connect(page.webSocketDebuggerUrl);

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const routeResults = [];

    for (let index = 0; index < routes.length; index += 1) {
      routeResults.push(await testRoute(send, events, routes[index], index));
    }

    const interactionResults = [
      await testLoginInvalid(send, events),
      await testSignupMismatch(send, events),
    ];

    ws.close();

    const failures = [
      ...routeResults.filter(
        (result) => !result.hasExpectedText || result.problems.length > 0
      ),
      ...interactionResults.filter(
        (result) => !result.ok || result.problems.length > 0
      ),
    ];

    const report = {
      baseUrl,
      routes: routeResults,
      interactions: interactionResults,
      failures,
    };

    await writeFile(
      path.join(resultDir, "report.json"),
      JSON.stringify(report, null, 2)
    );

    console.log(JSON.stringify(report, null, 2));

    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    browser.kill();
    await sleep(500);
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
