const DEFAULT_API_URL = "https://trainsystem-production.up.railway.app";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_API_URL;

type RequestOptions = RequestInit & {
  token?: string | null;
};

export type ApiUser = {
  id: string;
  username: string;
  role?: string;
  pelanggan?: ApiPelanggan | null;
  petugas?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiKereta = {
  id: string;
  nama?: string;
  namaKereta?: string;
  nama_kereta?: string;
  name?: string;
  kode?: string;
  kodeKereta?: string;
  kode_kereta?: string;
  kelas?: string;
  className?: string;
  status?: string;
  gerbong?: ApiGerbong[];
  gerbongs?: ApiGerbong[];
};

export type ApiGerbong = {
  id: string;
  nama?: string;
  namaGerbong?: string;
  nama_gerbong?: string;
  kode?: string;
  nomor?: string | number;
  kelas?: string;
  kapasitas?: number;
  kursi?: ApiKursi[];
};

export type ApiKursi = {
  id: string;
  nomor?: string;
  nomorKursi?: string;
  nomor_kursi?: string;
  status?: string;
};

export type ApiJadwal = {
  id: string;
  kereta?: ApiKereta;
  keretaId?: string;
  asal?: string;
  stasiunAsal?: string;
  stasiun_asal?: string;
  tujuan?: string;
  stasiunTujuan?: string;
  stasiun_tujuan?: string;
  tanggal?: string;
  tanggalBerangkat?: string;
  waktuBerangkat?: string;
  jamBerangkat?: string;
  waktuTiba?: string;
  jamTiba?: string;
  harga?: number | string;
  status?: string;
};

export type ApiPelanggan = {
  id: string;
  nik?: string;
  nama?: string;
  alamat?: string;
  telp?: string;
  user?: ApiUser;
};

export type ApiPembelian = {
  id: string;
  kode?: string;
  kodePembelian?: string;
  pelanggan?: ApiPelanggan;
  jadwal?: ApiJadwal;
  total?: number | string;
  totalBayar?: number | string;
  status?: string;
  createdAt?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  nik: string;
  nama: string;
  alamat: string;
  telp: string;
};

export type AuthResponse = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: ApiUser;
  role?: string;
};

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { token, headers, ...init } = options;
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join(", ")
          : "Terjadi kesalahan pada server";

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("railticket_token");
}

export function saveAuthSession(auth: AuthResponse) {
  const token = auth.access_token || auth.accessToken || auth.token;

  if (!token) {
    throw new Error("Login berhasil, tetapi token tidak ditemukan di response.");
  }

  localStorage.setItem("railticket_token", token);
  localStorage.setItem("railticket_user", JSON.stringify(auth.user ?? auth));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("railticket_token");
  localStorage.removeItem("railticket_user");
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "post",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getUsers(token?: string | null) {
  return apiRequest<ApiUser[]>("/users", { token });
}

export function getKereta() {
  return apiRequest<ApiKereta[]>("/kereta");
}

export function createKereta(data: {
  namaKereta: string;
  kodeKereta: string;
  kelas: string;
}) {
  return apiRequest<ApiKereta>("/kereta", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getJadwal() {
  return apiRequest<ApiJadwal[]>("/jadwal");
}

export function searchJadwal(params: {
  asal: string;
  tujuan: string;
  start: string;
  end: string;
}) {
  const query = new URLSearchParams(params);
  return apiRequest<ApiJadwal[]>(`/jadwal/search?${query.toString()}`);
}

export function getPelanggan(token?: string | null) {
  return apiRequest<ApiPelanggan[]>("/pelanggan", { token });
}

export function getPembelian(token?: string | null) {
  return apiRequest<ApiPembelian[]>("/pembelian", { token });
}

export function formatRupiah(value: number | string | undefined) {
  const numberValue = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isNaN(numberValue) ? 0 : numberValue);
}
