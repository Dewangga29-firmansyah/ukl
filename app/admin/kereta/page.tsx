'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Train, X, Loader2, Info } from 'lucide-react'

import AdminShell from '../components/AdminShell'

import {
  ApiKereta,
  ApiError,
  createKereta,
  getKereta,
  clearAuthSession,
} from '../../lib/api'

export default function AdminKeretaPage() {
  const router = useRouter()
  const [trains, setTrains] = useState<ApiKereta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [nama, setNama] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const data = await getKereta()
      setTrains(data)
      setError('')
    } catch (err) {
      if ((err instanceof ApiError && err.status === 401) || (err && typeof err === 'object' && 'status' in err && err.status === 401)) {
        clearAuthSession()
        router.push('/login')
        return
      }
      setError(
        err instanceof Error ? err.message : 'Gagal memuat data'
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
        alert('Nama kereta wajib diisi')
        return
      }

      setSubmitting(true)
      const created = await createKereta({ nama })

      setTrains((prev) => [created, ...prev])
      setNama('')
      setShowModal(false)
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Gagal tambah kereta'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminShell title="Kereta">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Data Master Kereta
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Daftar armada kereta aktif yang tersedia untuk manajemen operasional rute.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kereta</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Data Table Section */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#121b2d]/60 shadow-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/50">
              <th className="px-6 py-4">Informasi Armada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {loading ? (
              <tr>
                <td className="px-6 py-12 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                    <span>Memuat database kereta...</span>
                  </div>
                </td>
              </tr>
            ) : trains.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center p-4">
                    <Train className="h-8 w-8 text-slate-600 mb-2" />
                    <p className="text-slate-400 font-medium">Belum ada data armada kereta</p>
                  </div>
                </td>
              </tr>
            ) : (
              trains.map((train) => (
                <tr key={train.id} className="transition hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Train className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white tracking-wide text-base">
                          {train.nama}
                        </p>
                        <p className="font-mono text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          ID: {train.id}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add Train Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Train className="h-5 w-5 text-cyan-400" />
                Registrasi Kereta Baru
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nama Resmi Kereta Api
                </label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Argo Bromo Anggrek"
                  className="w-full h-12 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-12 rounded-xl border border-slate-800 px-5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  disabled={submitting}
                  onClick={handleCreate}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Data</span>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </AdminShell>
  )
}
