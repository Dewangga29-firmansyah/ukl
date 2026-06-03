'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'

import {
  ArrowRight,
  Calendar,
  Download,
  Loader2,
  QrCode,
  Train,
} from 'lucide-react'

import {
  API_URL,
  getAuthToken,
} from '@/app/lib/api'

type Detail = {
  id: string
  namaPenumpang: string

  kursi?: {
    label: string
  }

  gerbong?: {
    nama: string
  }
}

type Tiket = {
  id: string
  kodeBooking: string
  total: number
  status: string

  pelanggan?: {
    nama: string
  }

  jadwal?: {
    asal: string
    tujuan: string
    tanggalBerangkat: string

    kereta?: {
      nama: string
    }
  }

  payment?: {
    qrImageUrl?: string
  }

  detail?: Detail[]
}

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function Page({
  params,
}: Props) {
  const { id } =
    use(params)

  const [
    tiket,
    setTiket,
  ] =
    useState<Tiket>()

  const [
    loading,
    setLoading,
  ] =
    useState(true)

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
          },
        )

      const data =
        await res.json()

      setTiket(data)
    } catch {
      setTiket(undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function downloadTicket() {
    try {
      const token =
        getAuthToken()

      const res =
        await fetch(
          `${API_URL}/pembelian/${id}/tiket`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

      if (!res.ok) {
        const err =
          await res.json()

        throw new Error(
          err.message
        )
      }

      const blob =
        await res.blob()

      const url =
        URL.createObjectURL(
          blob,
        )

      const a =
        document.createElement(
          'a',
        )

      a.href =
        url

      a.download =
        `tiket-${id}.pdf`

      document.body.appendChild(
        a,
      )

      a.click()

      a.remove()

      URL.revokeObjectURL(
        url,
      )
    } catch (err) {
      alert(
        err instanceof
          Error
          ? err.message
          : 'Gagal download tiket',
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!tiket) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold text-white">
          Tiket Tidak Ditemukan
        </h1>

        <Link
          href="/pelanggan/tiket"
          className="
          mt-6
          inline-flex
          rounded-xl
          bg-cyan-400
          px-6
          py-3
          font-bold
          text-black
        "
        >
          Kembali
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <h1 className="text-3xl font-black text-white">
          E-Ticket
        </h1>

        <p className="mt-2 text-slate-400">
          {tiket.kodeBooking}
        </p>

      </div>

      <div
        className="
        rounded-[36px]
        border
        border-slate-800
        bg-[#121b2d]
        p-8
      "
      >

        <div className="flex items-center gap-3">

          <Train className="text-cyan-400" />

          <span className="text-2xl font-bold text-white">
            {
              tiket
                .jadwal
                ?.kereta
                ?.nama
            }
          </span>

        </div>

        <div className="mt-6 flex items-center gap-4 text-4xl font-black text-white">

          <span>
            {
              tiket
                .jadwal
                ?.asal
            }
          </span>

          <ArrowRight />

          <span>
            {
              tiket
                .jadwal
                ?.tujuan
            }
          </span>

        </div>

        <div className="mt-4 flex items-center gap-2 text-slate-400">

          <Calendar />

          {new Date(
            tiket
              .jadwal
              ?.tanggalBerangkat ??
            '',
          ).toLocaleString(
            'id-ID',
          )}

        </div>

        <div className="mt-8 grid gap-4">

          {tiket.detail?.map(
            (
              p,
            ) => (
              <div
                key={
                  p.id
                }
                className="
                rounded-2xl
                bg-[#0f172a]
                p-5
              "
              >

                <div className="font-bold text-white">
                  {
                    p.namaPenumpang
                  }
                </div>

                <div className="mt-1 text-slate-400">

                  Kursi{' '}

                  {
                    p.kursi
                      ?.label
                  }

                  {' • '}

                  {
                    p.gerbong
                      ?.nama
                  }

                </div>

              </div>
            ),
          )}

        </div>

        <div className="mt-10 flex justify-center">

          {tiket.payment
            ?.qrImageUrl ? (
            <img
              src={
                tiket
                  .payment
                  .qrImageUrl
              }
              className="
              w-[280px]
              rounded-3xl
            "
            />
          ) : (
            <div
              className="
              flex
              h-[280px]
              w-[280px]
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-slate-700
            "
            >

              <QrCode
                className="
                mb-4
                h-20
                w-20
                text-cyan-400
              "
              />

              <p className="text-slate-500">
                QR Tiket
              </p>

            </div>
          )}

        </div>

        <button
          onClick={
            downloadTicket
          }
          className="
    mt-10
    flex
    h-14
    w-full
    items-center
    justify-center
    gap-3
    rounded-2xl
    bg-cyan-400
    font-bold
    text-black
  "
        >

          <Download />

          Download Tiket PDF

        </button>

      </div>

    </div>
  )
}