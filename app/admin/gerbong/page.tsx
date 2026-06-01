'use client'

import { useEffect, useState } from 'react'
import {
  Armchair,
  Plus,
  TrainFront,
  Loader2,
  Layers,
  FileText,
  Users
} from 'lucide-react'

import AdminShell from '../components/AdminShell'
import {
  API_URL,
  ApiKereta,
  getAuthToken,
  getKereta,
} from '../../lib/api'

type Kelas = 'EKSEKUTIF' | 'BISNIS' | 'EKONOMI'

type GerbongCard = {
  id: string
  nama: string
  kelas: string
  kuota: number
  kereta: string
  kursi: number
}

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [trains, setTrains] = useState<ApiKereta[]>([])
  const [cards, setCards] = useState<GerbongCard[]>([])
  const [keretaId, setKeretaId] = useState('')
  const [nama, setNama] = useState('')
  const [kuota, setKuota] = useState(80)
  const [kelas, setKelas] = useState<Kelas>('EKSEKUTIF')

  async function load() {
    try {
      setLoading(true)
      const data = await getKereta()
      setTrains(data)

      if (data.length && !keretaId) {
        setKeretaId(data[0].id)
      }

      const mapped = data.flatMap((train) =>
        (train.gerbong || []).map((g) => ({
          id: g.id,
          nama: g.nama,
          kelas: g.kelas,
          kuota: g.kuota,
          kereta: train.nama,
          kursi: Array.isArray(g.kursi) ? g.kursi.length : 0,
        }))
      )

      setCards(mapped)
      setError('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat data'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate() {
    try {
      if (!nama.trim()) {
        alert('Nama gerbong wajib diisi')
        return
      }

      setSaving(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error('Login ulang')
      }

      const create = await fetch(`${API_URL}/kereta/gerbong`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, kuota, kelas, keretaId }),
      })

      const created = await create.json()

      if (!create.ok) {
        throw new Error(
          Array.isArray(created.message)
            ? created.message.join('\n')
            : created.message
        )
      }

      const generate = await fetch(
        `${API_URL}/kereta/generate-kursi/${created.id}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const generated = await generate.json()

      if (!generate.ok) {
        throw new Error(generated.message)
      }

      await new Promise((resolve) => setTimeout(resolve, 600))
      await load()

      const total = generated.total ?? generated.data?.total
      alert(
        total
          ? `Generate ${total} kursi berhasil`
          : generated.message || 'Generate berhasil'
      )

      setNama('')
      setKuota(80)
      setKelas('EKSEKUTIF')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  // Helper untuk pewarnaan badge kelas gerbong
  const getBadgeColor = (kelas: string) => {
    switch (kelas) {
      case 'EKSEKUTIF':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'BISNIS':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  }

  return (
    <AdminShell title="Gerbong">
      {/* Header Section */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Manajemen Gerbong & Kursi
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Tambah data gerbong baru dan generate susunan kursi secara otomatis.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        
        {/* Left Side: Form Panel */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-xl sticky top-6">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Tambah Gerbong
          </h2>
          
          <div className="space-y-4">
            {/* Input Pilih Kereta */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Pilih Kereta Api
              </label>
              <select
                value={keretaId}
                onChange={(e) => setKeretaId(e.target.value)}
                className="w-full h-12 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {trains.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Nama Gerbong */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nama / Nomor Gerbong
              </label>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Eksekutif 1, Ekonomi B"
                className="w-full h-12 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Input Kuota Kursi */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Kuota Maksimal Kursi
              </label>
              <input
                type="number"
                value={kuota}
                onChange={(e) => setKuota(Number(e.target.value))}
                className="w-full h-12 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Input Kelas */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Kelas Penumpang
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value as Kelas)}
                className="w-full h-12 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="EKSEKUTIF">EKSEKUTIF</option>
                <option value="BISNIS">BISNIS</option>
                <option value="EKONOMI">EKONOMI</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              disabled={saving}
              onClick={handleCreate}
              className="w-full mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Generate Gerbong</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: List Cards Gerbong */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            Daftar Aktif Gerbong ({cards.length})
          </h2>

          {loading ? (
            /* Skeleton Loading State */
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-44 animate-pulse rounded-2xl border border-slate-800 bg-[#121b2d]/50" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 p-12 text-center">
              <TrainFront className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">Belum ada data gerbong</p>
              <p className="text-xs text-slate-500 mt-1">Silakan tambahkan data melalui panel formulir.</p>
            </div>
          ) : (
            /* Data Grid */
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border border-slate-800 bg-[#121b2d]/40 p-5 shadow-sm transition duration-200 hover:border-slate-700 hover:bg-[#121b2d]/80"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition duration-200">
                        <TrainFront className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white tracking-wide">
                          {item.nama}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Users className="h-3 w-3 text-slate-500" />
                          {item.kereta}
                        </p>
                      </div>
                    </div>

                    {/* Badge Kelas */}
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBadgeColor(item.kelas)}`}>
                      {item.kelas}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Armchair className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium">
                        {item.kursi} / <span className="text-slate-500">{item.kuota}</span> Kursi
                      </span>
                    </div>
                    
                    {/* Indikator Status Sederhana */}
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminShell>
  )
}