'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Armchair,
  Plus,
  TrainFront,
  Loader2,
  Layers,
  FileText,
  Users,
} from 'lucide-react'

import AdminShell from '../components/AdminShell'

import {
  API_URL,
  ApiError,
  clearAuthSession,
  getAuthToken,
  getKereta,
} from '../../lib/api'

type Kelas =
  | 'EKSEKUTIF'
  | 'BISNIS'
  | 'EKONOMI'

type Train = {
  id: string
  nama?: string
  nama_kereta?: string

  gerbong?: {
    id: string
    nama: string
    kelas: string
    kuota?: number

    kursi?: {
      id: string
    }[]
  }[]
}

type GerbongCard = {
  id: string
  nama: string
  kelas: string
  kuota: number
  kereta: string
  kursi: number
}

export default function Page() {
  const router = useRouter()
  const [mounted, setMounted] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [trains, setTrains] =
    useState<Train[]>([])

  const [cards, setCards] =
    useState<GerbongCard[]>([])

  const [keretaId, setKeretaId] =
    useState('')

  const [nama, setNama] =
    useState('')

  const [kuota, setKuota] =
    useState(80)

  const [kelas, setKelas] =
    useState<Kelas>('EKSEKUTIF')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      load()
    }
  }, [mounted])

  async function load() {
    try {
      setLoading(true)

      const response =
        await getKereta()

      const data =
        Array.isArray(response)
          ? response
          : []

      setTrains(data)

      if (
        data.length &&
        !keretaId
      ) {
        setKeretaId(
          data[0]?.id ??
            ''
        )
      }

      const mapped =
        data.flatMap(
          (
            train: Train,
          ) =>
            (
              train
                .gerbong ??
              []
            ).map(
              (
                g,
              ) => ({
                id:
                  g.id,

                nama:
                  g.nama,

                kelas:
                  g.kelas,

                kuota:
                  g.kuota ??
                  0,

                kereta:
                  train.nama ??
                  train.nama_kereta ??
                  '-',

                kursi:
                  Array.isArray(
                    g.kursi,
                  )
                    ? g
                        .kursi
                        .length
                    : 0,
              }),
            ),
        )

      setCards(mapped)

      setError('')
    } catch (
      err
    ) {
      if ((err instanceof ApiError && err.status === 401) || (err && typeof err === 'object' && 'status' in err && (err as any).status === 401)) {
        clearAuthSession()
        router.push('/login')
        return
      }
      console.error(
        err,
      )

      setCards([])

      setError(
        err instanceof
          Error
          ? err.message
          : 'Gagal memuat data',
      )
    } finally {
      setLoading(
        false,
      )
    }
  }

  async function handleCreate() {
    try {
      if (!nama.trim()) {
        alert(
          'Nama gerbong wajib diisi',
        )
        return
      }

      if (!keretaId) {
        alert(
          'Pilih kereta',
        )
        return
      }

      setSaving(true)

      const token =
        getAuthToken()

      if (!token) {
        throw new Error(
          'Session habis',
        )
      }

      const create =
        await fetch(
          `${API_URL}/kereta/gerbong`,
          {
            method:
              'POST',

            headers:
              {
                Authorization:
                  `Bearer ${token}`,

                'Content-Type':
                  'application/json',
              },

            body:
              JSON.stringify(
                {
                  nama,
                  kuota,
                  kelas,
                  keretaId,
                },
              ),
          },
        )

      const created =
        await create.json()

      if (!create.ok) {
        throw new Error(
          created.message ??
            'Gagal',
        )
      }

      await fetch(
        `${API_URL}/kereta/generate-kursi/${created.id}`,
        {
          method:
            'POST',

          headers:
            {
              Authorization:
                `Bearer ${token}`,
            },
        },
      )

      setNama('')
      setKuota(80)

      await load()

      alert(
        'Gerbong berhasil dibuat',
      )
    } catch (
      err
    ) {
      alert(
        err instanceof
          Error
          ? err.message
          : 'Error',
      )
    } finally {
      setSaving(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <AdminShell title="Gerbong">

      <div className="space-y-8">

        {error && (
          <div className="rounded-xl bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="rounded-2xl bg-[#0f172a] p-6">

            <div className="space-y-4">

              <select
                value={keretaId}
                onChange={(e)=>
                  setKeretaId(
                    e.target.value,
                  )
                }
                className="h-12 w-full rounded-xl bg-[#121b2d] px-4"
              >
                {trains.map(
                  (
                    t,
                  )=>(
                    <option
                      key={
                        t.id
                      }
                      value={
                        t.id
                      }
                    >
                      {t.nama ??
                        t.nama_kereta}
                    </option>
                  ),
                )}
              </select>

              <input
                value={nama}
                onChange={(e)=>
                  setNama(
                    e.target
                      .value,
                  )
                }
                className="h-12 w-full rounded-xl bg-[#121b2d] px-4"
                placeholder="Nama Gerbong"
              />

              <button
                onClick={
                  handleCreate
                }
                disabled={
                  saving
                }
                className="h-12 w-full rounded-xl bg-cyan-400 text-black font-bold"
              >
                {saving
                  ? 'Menyimpan...'
                  : 'Tambah'}
              </button>

            </div>

          </div>

          <div className="lg:col-span-2">

            {loading ? (
              <Loader2 className="animate-spin text-cyan-400" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">

                {cards.map(
                  (
                    item,
                  )=>(
                    <div
                      key={
                        item.id
                      }
                      className="rounded-2xl bg-[#121b2d] p-5"
                    >
                      <h3 className="text-white font-bold">
                        {
                          item.nama
                        }
                      </h3>

                      <p className="text-slate-400">
                        {
                          item.kereta
                        }
                      </p>

                      <div className="mt-4 flex gap-4">

                        <span>
                          Kursi:
                          {' '}
                          {
                            item.kursi
                          }
                        </span>

                        <span>
                          Kuota:
                          {' '}
                          {
                            item.kuota
                          }
                        </span>

                      </div>

                    </div>
                  ),
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </AdminShell>
  )
}
