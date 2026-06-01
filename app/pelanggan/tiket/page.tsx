'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  ArrowRight,
  Calendar,
  Loader2,
  Ticket,
  Train,
} from 'lucide-react'

import {
  API_URL,
  getAuthToken,
} from '@/app/lib/api'

type Tiket = {
  id: string
  kodeBooking: string
  status: string
  total: number

  jadwal?: {
    asal?: string
    tujuan?: string
    tanggalBerangkat?: string

    kereta?: {
      nama?: string
    }
  }

  detail?: unknown[]
}

export default function Page() {
  const [loading, setLoading] =
    useState(true)

  const [tiket, setTiket] =
    useState<Tiket[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)

      const token =
        getAuthToken()

      if (!token) {
        setTiket([])
        return
      }

      const res =
        await fetch(
          `${API_URL}/pembelian/mine`,
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,

              'Cache-Control':
                'no-cache',
            },

            cache:
              'no-store',
          },
        )

      if (!res.ok) {
        setTiket([])
        return
      }

      const json =
        await res.json()

      console.log(
        'TIKET USER:',
        json,
      )

      if (
        !Array.isArray(
          json,
        )
      ) {
        setTiket([])
        return
      }

      setTiket(
        json,
      )
    } catch (
      err
    ) {
      console.error(
        err,
      )

      setTiket([])
    } finally {
      setLoading(
        false,
      )
    }
  }

  function badge(
    status?: string,
  ) {
    if (
      status ===
      'PAID'
    ) {
      return 'bg-green-500/20 text-green-400'
    }

    if (
      status ===
      'PENDING'
    ) {
      return 'bg-yellow-500/20 text-yellow-400'
    }

    return 'bg-red-500/20 text-red-400'
  }

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (
    tiket.length ===
    0
  ) {
    return (
      <div className="py-24 text-center">

        <Ticket
          size={
            72
          }
          className="mx-auto text-slate-600"
        />

        <h1 className="mt-6 text-3xl font-black text-white">
          Belum Ada Tiket
        </h1>

        <p className="mt-2 text-slate-500">
          Anda belum melakukan transaksi
        </p>

        <Link
          href="/pelanggan"
          className="
            mt-8
            inline-flex
            rounded-xl
            bg-cyan-400
            px-6
            py-3
            font-bold
            text-black
          "
        >
          Cari Tiket
        </Link>

      </div>
    )
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-black text-white">
          Tiket Saya
        </h1>

        <p className="mt-2 text-slate-400">
          Tiket hanya milik akun ini
        </p>

      </div>

      <div className="grid gap-6">

        {tiket.map(
          (
            item,
          ) => (
            <div
              key={
                item.id
              }
              className="rounded-3xl border border-slate-800 bg-[#121b2d] p-8"
            >

              <div className="flex justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <Train className="text-cyan-400" />

                    <h2 className="text-2xl font-black text-white">

                      {
                        item
                          .jadwal
                          ?.kereta
                          ?.nama ??
                        '-'
                      }

                    </h2>

                  </div>

                  <p className="mt-3 text-slate-500">
                    {
                      item.kodeBooking
                    }
                  </p>

                </div>

                <div
                  className={`rounded-xl px-4 py-2 font-bold ${badge(item.status)}`}
                >
                  {
                    item.status
                  }
                </div>

              </div>

              <div className="mt-8 flex items-center gap-4 text-3xl font-black text-white">

                <span>
                  {
                    item
                      .jadwal
                      ?.asal ??
                    '-'
                  }
                </span>

                <ArrowRight />

                <span>
                  {
                    item
                      .jadwal
                      ?.tujuan ??
                    '-'
                  }
                </span>

              </div>

              <div className="mt-5 flex items-center gap-2 text-slate-400">

                <Calendar />

                {item
                  .jadwal
                  ?.tanggalBerangkat
                  ? new Date(
                      item
                        .jadwal
                        .tanggalBerangkat,
                    ).toLocaleString(
                      'id-ID',
                    )
                  : '-'}

              </div>

              <div className="mt-4 text-cyan-400">

                {
                  item
                    .detail
                    ?.length ??
                  0
                } Penumpang

              </div>

              <div className="mt-8">

                {item.status ===
                'PAID' ? (
                  <Link
                    href={`/pelanggan/tiket/${item.id}`}
                    className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
                  >
                    Lihat Tiket
                  </Link>
                ) : (
                  <Link
                    href={`/pelanggan/pembayaran?id=${item.id}`}
                    className="rounded-xl border border-cyan-400 px-6 py-3 font-bold text-cyan-400"
                  >
                    Bayar
                  </Link>
                )}

              </div>

            </div>
          ),
        )}

      </div>

    </div>
  )
}