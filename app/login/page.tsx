"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, saveAuthSession } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    formRef.current?.setAttribute("data-ready", "true");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const username = String(formData.get("username") || "");
      const password = String(formData.get("password") || "");
      const auth = await login({ username, password });
      saveAuthSession(auth);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#010818]">
      <div
        className="relative hidden w-1/2 bg-cover bg-center lg:flex"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-[#00152e]/80"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0a2347]/40 to-[#010818]"></div>

        <div className="relative z-10 flex h-full flex-col justify-between px-24 py-14">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-[#08152d]/80 px-6 py-4 backdrop-blur-md">
              <span className="text-xl text-cyan-400">Rail</span>
              <span className="text-2xl font-bold text-white">
                Rail<span className="text-cyan-400">Ticket</span>
              </span>
            </div>
          </div>

          <div className="max-w-xl">
            <h1 className="text-7xl font-bold leading-tight text-white">
              Selamat Datang
            </h1>
            <h2 className="mt-2 text-7xl font-bold text-cyan-400">Kembali</h2>
            <p className="mt-8 text-2xl leading-relaxed text-gray-300">
              Masuk ke akun RailTicket untuk mengelola perjalanan dan pemesanan
              tiket kereta Anda.
            </p>
          </div>

          <p className="text-lg text-gray-400">
            © 2026 RailTicket Core Engine. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-xl">
          <Link
            href="/dashboard"
            className="mb-10 inline-flex items-center gap-3 text-gray-400 hover:text-cyan-400"
          >
            Kembali
          </Link>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            data-ready="false"
            className="rounded-3xl border border-cyan-500/10 bg-[#030f2b] p-10 shadow-[0_0_40px_rgba(0,255,255,0.05)]"
          >
            <div className="mb-8">
              <label className="mb-3 block text-sm font-semibold uppercase text-gray-400">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Masukkan username"
                className="h-16 w-full rounded-2xl border border-cyan-500/10 bg-[#01081c] px-6 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold uppercase text-gray-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                className="h-16 w-full rounded-2xl border border-cyan-500/10 bg-[#01081c] px-6 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
                required
              />
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 h-16 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xl font-bold text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-10 text-center text-lg text-gray-400">
            Belum memiliki akun?{" "}
            <Link
              href="/signup"
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
