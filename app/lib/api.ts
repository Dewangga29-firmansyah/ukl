const DEFAULT_API_URL =
  'https://trainsystem-production.up.railway.app'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/$/,
    ''
  ) || DEFAULT_API_URL

type RequestOptions =
  RequestInit & {
    token?: string | null
  }

export type LoginPayload = {
  username: string
  password: string
}

export type ApiUser = {
  id: string
  username: string
  role?: string
}

export type AuthResponse = {
  access_token?: string
  accessToken?: string
  token?: string

  user?: ApiUser

  data?: {
    access_token?: string
    accessToken?: string
    token?: string
    user?: ApiUser
  }
}

export type ApiKereta = {
  id: string
  nama: string
  deskripsi: string
}

export type ApiJadwal = {
 id:string
 asal:string
 tujuan:string
 tanggalBerangkat:string
 tanggalTiba:string
 harga:number

 kereta?:{
   nama:string
 }
}

export type ApiPelanggan = {
  id: string
  nama?: string
}

export type ApiPembelian = {
 id:string
 kode?:string
 kodePembelian?:string
 total?:number
 totalBayar?:number
 status?:string

 pelanggan?:{
   nama?:string
   user?:{
    username:string
   }
 }
}

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(
    message: string,
    status: number,
    detail: unknown
  ) {
    super(message)

    this.status = status
    this.detail = detail
  }
}

async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
) {
  const {
    token,
    headers,
    ...init
  } = options

  const res = await fetch(
    `${API_URL}${path}`,
    {
      cache: 'no-store',

      ...init,

      headers: {
        'Content-Type':
          'application/json',

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...headers,
      },
    }
  )

  const text =
    await res.text()

  const data =
    text
      ? JSON.parse(text)
      : null

  if (!res.ok) {
    throw new ApiError(
      data?.message ||
        'Request gagal',
      res.status,
      data
    )
  }

  return data as T
}

export function login(
  payload: LoginPayload
) {
  return apiRequest<AuthResponse>(
    '/auth/login',
    {
      method: 'POST',
      body:
        JSON.stringify(
          payload
        ),
    }
  )
}

export function saveAuthSession(
  auth: AuthResponse
) {
  if (
    typeof window ===
    'undefined'
  ) {
    return
  }

  const token =
    auth.access_token ||
    auth.accessToken ||
    auth.token ||
    auth.data
      ?.access_token ||
    auth.data
      ?.accessToken ||
    auth.data?.token

  const user =
    auth.user ||
    auth.data?.user

  if (!token) {
    throw new Error(
      'Token tidak ditemukan'
    )
  }

  localStorage.setItem(
    'railticket_token',
    token
  )

  localStorage.setItem(
    'railticket_user',
    JSON.stringify(
      user
    )
  )
}

export function getAuthToken() {
  if (
    typeof window ===
    'undefined'
  ) {
    return null
  }

  return localStorage.getItem(
    'railticket_token'
  )
}

export function getAuthUser() {
  if (
    typeof window ===
    'undefined'
  ) {
    return null
  }

  try {
    const raw =
      localStorage.getItem(
        'railticket_user'
      )

    if (
      !raw ||
      raw ===
        'undefined' ||
      raw ===
        'null'
    ) {
      return null
    }

    return JSON.parse(
      raw
    )

  } catch (
    error
  ) {

    console.error(
      'Invalid user session'
    )

    localStorage.removeItem(
      'railticket_user'
    )

    return null

  }
}

export function clearAuthSession() {
  localStorage.removeItem(
    'railticket_token'
  )

  localStorage.removeItem(
    'railticket_user'
  )
}

export function getKereta() {
  return apiRequest<ApiKereta[]>(
    '/kereta'
  )
}

export function createKereta(
  data: {
    nama: string
  }
) {
  return apiRequest<ApiKereta>(
    '/kereta',
    {
      method: 'POST',
      token: getAuthToken(),
      body: JSON.stringify(data),
    }
  )
}

export function getJadwal() {
  return apiRequest<ApiJadwal[]>(
    '/jadwal'
  )
}

export function getPelanggan(
  token?: string | null
) {
  return apiRequest<
    ApiPelanggan[]
  >('/pelanggan', {
    token,
  })
}

export function getPembelian(
  token?: string | null
) {
  return apiRequest<
    ApiPembelian[]
  >('/pembelian', {
    token,
  })
}

export function formatRupiah(
  value:
    | number
    | string
    | undefined
) {
  const amount =
    Number(value ?? 0)

  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }
  ).format(
    Number.isNaN(amount)
      ? 0
      : amount
  )
}