'use client'

import { useEffect, useState } from 'react'

import {
  useRouter,
  useSearchParams,
} from 'next/navigation'

import QRCode from 'react-qr-code'

import {
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  Train,
} from 'lucide-react'

import {
  API_URL,
  getAuthToken,
} from '@/app/lib/api'

type Data = {
  id: string
  kodeBooking: string
  total: number
  status: string

  jadwal: {
    asal: string
    tujuan: string
    tanggalBerangkat: string

    kereta: {
      nama: string
    }
  }

  detail: {
    namaPenumpang: string
    kursi: {
      label: string
    }
  }[]
}

export default function Page() {
  const router =
    useRouter()

  const search =
    useSearchParams()

  const id =
    search.get('id')

  const [loading, setLoading] =
    useState(true)

  const [paying, setPaying] =
    useState(false)

  const [data, setData] =
    useState<Data>()

  async function load() {
    try {
      const token =
        getAuthToken()

      const res =
        await fetch(
          `${API_URL}/pembelian/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      const json =
        await res.json()

      setData(
        json
      )

    } finally {
      setLoading(
        false
      )
    }
  }

  useEffect(() => {
    if (id)
      load()
  }, [id])

  async function bayar() {
    try {
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

      const json =
        await res.json()

      if (
        !res.ok
      ) {
        throw new Error(
          json.message
        )
      }

      alert(
        'Pembayaran berhasil'
      )

      router.push(
        `/pelanggan/tiket/${id}`
      )

    } catch (
      err
    ) {
      alert(
        err instanceof
          Error
            ? err.message
            : 'Error'
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
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" />
      </div>
    )
  }

  if (
    !data
  ) {
    return (
      <div className="text-white">
        Data tidak ditemukan
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

      <div className="space-y-6">

        <div className="rounded-[32px] bg-[#121b2d] p-8">

          <div className="flex items-center gap-4">

            <Train className="text-cyan-400" />

            <div>

              <h1 className="text-4xl font-black text-white">
                {
                  data.jadwal
                    .kereta
                    .nama
                }
              </h1>

              <p className="text-[#8fb5df]">
                {
                  data.jadwal
                    .asal
                }

                →

                {
                  data.jadwal
                    .tujuan
                }
              </p>

            </div>

          </div>

          <div className="mt-10 rounded-3xl bg-[#09111f] p-10">

            <div className="flex justify-center">

              <div className="rounded-3xl bg-white p-6">

                <QRCode
                  value={
                    JSON.stringify(
                      {
                        id:
                          data.id,

                        kode:
                          data.kodeBooking,
                      }
                    )
                  }
                  size={
                    240
                  }
                />

              </div>

            </div>

            <div className="mt-8 text-center">

              <h2 className="text-3xl font-black text-cyan-400">
                {
                  data.kodeBooking
                }
              </h2>

              <p className="mt-2 text-[#8fb5df]">
                Tunjukkan QR ini saat boarding
              </p>

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

          <div className="mt-8 space-y-5">

            <div className="flex justify-between">

              <span className="text-[#8fb5df]">
                Status
              </span>

              <span className="text-cyan-400">

                {
                  data.status
                }

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-[#8fb5df]">
                Jadwal
              </span>

              <span className="text-white">

                <Calendar className="mr-2 inline h-4" />

                {new Date(
                  data
                    .jadwal
                    .tanggalBerangkat
                ).toLocaleDateString(
                  'id-ID'
                )}

              </span>

            </div>

            <div>

              <div className="text-[#8fb5df]">
                Penumpang
              </div>

              <div className="mt-3 space-y-2">

                {data.detail.map(
                  (
                    p,
                    i
                  ) => (

                    <div
                      key={
                        i
                      }
                      className="rounded-xl bg-[#09111f] p-3 text-white"
                    >

                      {
                        p.namaPenumpang
                      }

                      {' • '}

                      {
                        p.kursi
                          .label
                      }

                    </div>

                  )
                )}

              </div>

            </div>

            <div className="border-t border-white/10 pt-6">

              <div className="flex justify-between">

                <span className="text-white">
                  Total
                </span>

                <span className="text-4xl font-black text-cyan-400">

                  Rp{' '}

                  {data.total.toLocaleString(
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
                mt-6
                h-16
                w-full
                rounded-2xl
                bg-cyan-400
                text-xl
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