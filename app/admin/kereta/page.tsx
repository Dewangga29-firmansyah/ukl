'use client'

import { useEffect, useState } from 'react'
import { Plus, Train, X } from 'lucide-react'

import AdminShell from '../components/AdminShell'

import {
  ApiKereta,
  createKereta,
  getKereta,
} from '../../lib/api'

export default function AdminKeretaPage() {
  const [trains, setTrains] =
    useState<ApiKereta[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [showModal, setShowModal] =
    useState(false)

  const [nama, setNama] =
    useState('')

  async function loadData() {
    try {
      setLoading(true)

      const data =
        await getKereta()

      setTrains(data)

      setError('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat data'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCreate() {
    try {
      if (!nama.trim()) {
        alert(
          'Nama kereta wajib diisi'
        )

        return
      }

      const created =
        await createKereta({
          nama,
        })

      setTrains((prev) => [
        created,
        ...prev,
      ])

      setNama('')

      setShowModal(false)

    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Gagal tambah kereta'
      )
    }
  }

  return (
    <AdminShell title="Kereta">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-black text-white">
            Data Kereta
          </h1>

          <p className="mt-2 text-[#88a8d6]">
            Kelola data kereta
          </p>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
          flex
          items-center
          gap-2
          rounded-2xl
          bg-cyan-400
          px-5
          py-3
          font-bold
          text-black
        "
        >
          <Plus size={18} />

          Tambah
        </button>

      </div>

      {error && (
        <div className="mt-8 rounded-2xl bg-red-500/10 p-5 text-red-200">
          {error}
        </div>
      )}

      <div
        className="
        mt-8
        overflow-hidden
        rounded-3xl
        border
        border-[#233554]
        bg-[#101828]
      "
      >

        <table className="w-full">

          <thead>

            <tr className="border-b border-[#233554]">

              <th className="px-6 py-5 text-left text-[#89a9d5]">
                Kereta
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td className="px-6 py-10 text-[#89a9d5]">
                  Memuat data...
                </td>

              </tr>

            ) : trains.length === 0 ? (

              <tr>

                <td className="px-6 py-10 text-[#89a9d5]">
                  Belum ada data
                </td>

              </tr>

            ) : (

              trains.map(
                (train) => (

                  <tr
                    key={train.id}
                    className="
                    border-b
                    border-[#18263f]
                    last:border-0
                  "
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div
                          className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          bg-cyan-500/10
                        "
                        >

                          <Train
                            className="text-cyan-300"
                          />

                        </div>

                        <div>

                          <p className="font-bold text-white">
                            {train.nama}
                          </p>

                          <p className="text-sm text-[#89a9d5]">
                            {train.id}
                          </p>

                        </div>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

          <div
            className="
            w-full
            max-w-lg
            rounded-3xl
            bg-[#101828]
            p-8
          "
          >

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-white">
                Tambah Kereta
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X className="text-white" />
              </button>

            </div>

            <input
              value={nama}
              onChange={(e) =>
                setNama(
                  e.target.value
                )
              }
              placeholder="Nama Kereta"
              className="
              w-full
              rounded-xl
              border
              border-[#233554]
              bg-[#0f172a]
              px-5
              py-4
              text-white
            "
            />

            <button
              onClick={
                handleCreate
              }
              className="
              mt-6
              w-full
              rounded-xl
              bg-cyan-400
              py-4
              font-bold
              text-black
            "
            >
              Simpan
            </button>

          </div>

        </div>

      )}

    </AdminShell>
  )
}