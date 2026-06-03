'use client'

import {
  Suspense,
  useEffect,
  useState,
} from 'react'

import {
  useRouter,
  useSearchParams,
} from 'next/navigation'

import Link from 'next/link'

import QRCode from 'react-qr-code'

import {
  Calendar,
  CreditCard,
  Loader2,
  Train,
  CheckCircle2,
} from 'lucide-react'

import {
  API_URL,
  getAuthToken,
} from '@/app/lib/api'

export const dynamic =
  'force-dynamic'

type Data = {
  id: string
  kodeBooking: string
  total: number
  status: string

  jadwal?: {
    asal?: string
    tujuan?: string
    tanggalBerangkat?: string

    kereta?: {
      nama?: string
    }
  }

  detail?: {
    namaPenumpang: string

    kursi?: {
      label?: string
    }
  }[]
}

function Content() {
  const router =
    useRouter()

  const search =
    useSearchParams()

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    paying,
    setPaying,
  ] =
    useState(false)

  const [
    showReceipt,
    setShowReceipt,
  ] =
    useState(false)

  const [
    data,
    setData,
  ] =
    useState<Data | null>(
      null
    )

  useEffect(() => {
    async function load() {
      try {
        const id =
          search.get(
            'id'
          )

        if (!id) {
          setLoading(
            false
          )
          return
        }

        const token =
          getAuthToken()

        const res =
          await fetch(
            `${API_URL}/pembelian/mine/${id}`,
            {
              headers:
                {
                  Authorization:
                    `Bearer ${token}`,
                },

              cache:
                'no-store',
            }
          )

        if (!res.ok) {
          throw new Error()
        }

        const json =
          await res.json()

        setData(
          json
        )
      } catch {
        setData(
          null
        )
      } finally {
        setLoading(
          false
        )
      }
    }

    load()
  }, [search])

  async function bayar() {
    try {
      const id =
        search.get(
          'id'
        )

      if (!id)
        return

      setPaying(
        true
      )

      const token =
        getAuthToken()

      const res =
        await fetch(
          `${API_URL}/pembelian/${id}/confirm`,
          {
            method:
              'PATCH',

            headers:
              {
                Authorization:
                  `Bearer ${token}`,
              },
          }
        )

      if (!res.ok) {
        throw new Error()
      }

      setData((prev) => prev ? { ...prev, status: 'PAID' } : prev)
      setShowReceipt(true)
    } finally {
      setPaying(
        false
      )
    }
  }

  if (
    loading
  ) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (
    !data
  ) {
    return (
      <div className="py-24 text-center text-white">
        Data pembayaran tidak ditemukan
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

      <div>

        <div className="rounded-[32px] bg-[#121b2d] p-8">

          <div className="flex items-center gap-4">

            <Train className="text-cyan-400" />

            <div>

              <h1 className="text-4xl font-black text-white">
                {
                  data
                    .jadwal
                    ?.kereta
                    ?.nama
                    ??
                  '-'
                }
              </h1>

              <p className="text-[#8fb5df]">
                {
                  data
                    .jadwal
                    ?.asal
                }

                →

                {
                  data
                    .jadwal
                    ?.tujuan
                }
              </p>

            </div>

          </div>

          <div className="mt-8 rounded-3xl bg-[#09111f] p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Scan QRIS untuk Membayar</h3>
              <p className="text-sm text-slate-400">Gunakan BCA, GoPay, OVO, Dana, atau lainnya</p>
            </div>
            <div className="flex justify-center">
              <div className="rounded-3xl bg-white p-6">
                <QRCode
                  size={240}
                  value={
                    data.kodeBooking
                  }
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-3xl font-black text-cyan-400">
                {
                  data.kodeBooking
                }
              </div>
            </div>
          </div>

        </div>

      </div>

      <div>

        <div className="sticky top-6 rounded-[32px] bg-[#121b2d] p-8">

          <h2 className="flex items-center gap-3 text-2xl font-black text-white">

            <CreditCard />

            Pembayaran

          </h2>

          <div className="mt-8">

            <div className="flex justify-between">

              <span className="text-slate-400">
                Status
              </span>

              <span className="text-cyan-400">
                {
                  data.status
                }
              </span>

            </div>

            <div className="mt-5 flex justify-between">

              <span className="text-slate-400">
                Jadwal
              </span>

              <span className="text-white">

                <Calendar className="mr-2 inline h-4" />

                {
                  data
                    .jadwal
                    ?.tanggalBerangkat
                    ? new Date(
                        data.jadwal.tanggalBerangkat
                      ).toLocaleDateString(
                        'id-ID'
                      )
                    : '-'
                }

              </span>

            </div>

            <div className="mt-8 border-t border-white/10 pt-8">

              <div className="flex justify-between">

                <span className="text-white">
                  Total
                </span>

                <span className="text-4xl font-black text-cyan-400">

                  Rp

                  {' '}

                  {(
                    data.total ??
                    0
                  ).toLocaleString(
                    'id-ID'
                  )}

                </span>

              </div>

            </div>

            {data.status ===
              'PENDING' ? (

              <button
                onClick={
                  bayar
                }
                disabled={
                  paying
                }
                className="
                mt-8
                h-14
                w-full
                rounded-2xl
                bg-cyan-400
                font-black
                text-black
              "
              >
                {paying
                  ? 'Memproses...'
                  : 'Bayar Sekarang'}
              </button>

            ) : (

              <Link
                href={`/pelanggan/tiket/${data.id}`}
                className="
                mt-8
                flex
                h-14
                w-full
                items-center
                justify-center
                rounded-2xl
                bg-green-500
                font-black
                text-white
              "
              >
                Lihat E-Ticket
              </Link>

            )}

          </div>

        </div>
      </div>

      {showReceipt && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[32px] bg-[#121b2d] border border-green-500/30 p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-cyan-400"></div>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Pembayaran Berhasil!</h2>
            <p className="text-slate-400 mb-8">Terima kasih, transaksi kamu sukses.</p>
            
            <div className="rounded-3xl bg-[#09111f] p-6 mb-8 text-left border border-white/5">
              <div className="flex justify-between mb-4 border-b border-white/5 pb-4">
                <span className="text-slate-400">Kode Booking</span>
                <span className="font-bold text-white tracking-wider">{data.kodeBooking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Dibayar</span>
                <span className="font-bold text-cyan-400 text-lg">Rp {(data.total ?? 0).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Link
              href={`/pelanggan/tiket/${data.id}`}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-cyan-400 font-black text-black hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              Lihat E-Ticket Sekarang
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
        </div>
      }
    >
      <Content />
    </Suspense>
  )
}