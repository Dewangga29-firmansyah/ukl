'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  CalendarDays,
  Loader2,
  MapPin,
  Search,
  Train,
  ArrowRight,
} from 'lucide-react'

import {
  API_URL,
  getAuthToken,
} from '../../lib/api'

interface Jadwal {
  id: string

  asal: string

  tujuan: string

  tanggalBerangkat: string

  tanggalTiba: string

  harga: number

  kereta: {
    id: string
    nama: string
  }
}

export default function CariTiketPage() {
  const [loading, setLoading] =
    useState(true)

  const [jadwal, setJadwal] =
    useState<Jadwal[]>([])

  const [asal, setAsal] =
    useState('')

  const [tujuan, setTujuan] =
    useState('')

  const [tanggal, setTanggal] =
    useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)

      const params =
        new URLSearchParams()

      if (asal) {
        params.append(
          'asal',
          asal
        )
      }

      if (tujuan) {
        params.append(
          'tujuan',
          tujuan
        )
      }

      if (tanggal) {
        params.append(
          'start',
          `${tanggal}T00:00:00`
        )

        params.append(
          'end',
          `${tanggal}T23:59:59`
        )
      }

      const url =
        params.toString()
          ? `${API_URL}/jadwal/search?${params}`
          : `${API_URL}/jadwal`

      const token = getAuthToken()
      const res =
        await fetch(
          url,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            cache:
              'no-store',
          }
        )

      const data =
        await res.json()

      setJadwal(
        Array.isArray(
          data
        )
          ? data
          : []
      )
    } finally {
      setLoading(
        false
      )
    }
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-4xl font-black text-white">
          Cari Tiket
        </h1>

        <p className="mt-2 text-[#89a9d5]">
          Temukan perjalanan terbaik
        </p>

      </div>

      <div className="rounded-[30px] bg-[#121b2d] p-6">

        <div className="grid gap-4 lg:grid-cols-4">

          <div className="relative">

            <MapPin
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-cyan-400
            "
            />

            <input
              value={asal}
              onChange={(e) =>
                setAsal(
                  e.target
                    .value
                )
              }
              placeholder="Asal"
              className="
              h-14
              w-full
              rounded-xl
              bg-[#0f172a]
              pl-12
              text-white
            "
            />

          </div>

          <div className="relative">

            <MapPin
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-cyan-400
            "
            />

            <input
              value={
                tujuan
              }
              onChange={(e) =>
                setTujuan(
                  e.target
                    .value
                )
              }
              placeholder="Tujuan"
              className="
              h-14
              w-full
              rounded-xl
              bg-[#0f172a]
              pl-12
              text-white
            "
            />

          </div>

          <div className="relative">

            <CalendarDays
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-cyan-400
            "
            />

            <input
              type="date"
              value={
                tanggal
              }
              onChange={(e) =>
                setTanggal(
                  e.target
                    .value
                )
              }
              className="
              h-14
              w-full
              rounded-xl
              bg-[#0f172a]
              pl-12
              text-white
              [color-scheme:dark]
            "
            />

          </div>

          <button
            onClick={
              load
            }
            className="
            flex
            h-14
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-cyan-400
            font-bold
            text-black
            hover:bg-cyan-300
            "
          >

            <Search />

            Cari

          </button>

        </div>

      </div>

      {loading ? (

        <div className="flex justify-center py-20">

          <Loader2
            className="
            h-10
            w-10
            animate-spin
            text-cyan-400
            "
          />

        </div>

      ) : jadwal.length ? (

        <div className="space-y-5">

          {jadwal.map(
            (
              item
            ) => (

              <div
                key={
                  item.id
                }
                className="
                rounded-[30px]
                bg-[#121b2d]
                p-6
              "
              >

                <div
                  className="
                  flex
                  flex-col
                  gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
                >

                  <div>

                    <div className="flex items-center gap-3">

                      <Train className="text-cyan-400" />

                      <h2 className="text-xl font-black text-white">

                        {
                          item
                            .kereta
                            .nama
                        }

                      </h2>

                    </div>

                    <div className="mt-4 flex items-center gap-3 text-[#89a9d5]">

                      <span>
                        {
                          item.asal
                        }
                      </span>

                      <ArrowRight />

                      <span>
                        {
                          item.tujuan
                        }
                      </span>

                    </div>

                    <p className="mt-3 text-[#89a9d5]">

                      {new Date(
                        item.tanggalBerangkat
                      ).toLocaleString(
                        'id-ID'
                      )}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[#89a9d5]">
                      Mulai dari
                    </p>

                    <h2 className="text-3xl font-black text-green-400">

                      Rp{' '}

                      {item.harga.toLocaleString(
                        'id-ID'
                      )}

                    </h2>

                    <Link
                      href={`/pelanggan/pesan/${item.id}`}
                      className="
                      mt-4
                      inline-flex
                      rounded-xl
                      bg-cyan-400
                      px-6
                      py-3
                      font-bold
                      text-black
                    "
                    >
                      Pesan
                    </Link>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      ) : (

        <div className="rounded-[30px] bg-[#121b2d] py-24 text-center">

          <Train
            size={50}
            className="mx-auto text-[#37557a]"
          />

          <p className="mt-6 text-[#89a9d5]">
            Jadwal tidak ditemukan
          </p>

        </div>

      )}

    </div>
  )
}