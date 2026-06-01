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

import QRCode from 'react-qr-code'

import {
  Calendar,
  CreditCard,
  Loader2,
  Train,
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
            `${API_URL}/pembelian/${id}`,
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

      router.push(
        `/pelanggan/tiket/${id}`
      )
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
              'PENDING' && (

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

            )}

          </div>

        </div>

      </div>

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