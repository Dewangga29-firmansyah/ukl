'use client'

import { useEffect, useState } from 'react'
import {
  Pencil,
  Plus,
  Trash,
  X,
  Calendar,
  MapPin,
  ArrowRight,
  Train,
  DollarSign
} from 'lucide-react'

import AdminShell from '../components/AdminShell'
import {
  API_URL,
  ApiJadwal,
  ApiKereta,
  formatRupiah,
  getAuthToken,
  getJadwal,
  getKereta,
} from '../../lib/api'

type Form = {
  asal: string
  tujuan: string
  tanggalBerangkat: string
  tanggalTiba: string
  harga: number
  keretaId: string
}

const empty: Form = {
  asal: '',
  tujuan: '',
  tanggalBerangkat: '',
  tanggalTiba: '',
  harga: 0,
  keretaId: '',
}

export default function Page() {
  const [data, setData] = useState<ApiJadwal[]>([])
  const [trains, setTrains] = useState<ApiKereta[]>([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editId, setEditId] = useState('')
  const [form, setForm] = useState<Form>(empty)

  async function load() {
    setLoading(true)
    try {
      const [jadwal, kereta] = await Promise.all([
        getJadwal(),
        getKereta(),
      ])

      setData(jadwal)
      setTrains(kereta)

      if (kereta[0]) {
        setForm((s) => ({
          ...s,
          keretaId: kereta[0].id,
        }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function submit() {
    const token = getAuthToken()
    const url = editId ? `${API_URL}/jadwal/${editId}` : `${API_URL}/jadwal`
    const method = editId ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const result = await res.json()

    if (!res.ok) {
      alert(result.message)
      return
    }

    await load()
    setShow(false)
    setEditId('')
    setForm(empty)
  }

  async function remove(id: string) {
    if (!confirm('Hapus jadwal?')) {
      return
    }

    await fetch(`${API_URL}/jadwal/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })

    load()
  }

  function edit(item: ApiJadwal) {
    setEditId(item.id)
    setForm({
      asal: item.asal,
      tujuan: item.tujuan,
      tanggalBerangkat: item.tanggalBerangkat.slice(0, 16),
      tanggalTiba: item.tanggalTiba.slice(0, 16),
      harga: item.harga,
      keretaId: item.keretaId,
    })
    setShow(true)
  }

  // Helper untuk format tanggal di tabel agar rapi
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  return (
    <AdminShell title="Jadwal">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Jadwal Penerbangan / Kereta
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola rute, waktu keberangkatan, dan harga tiket perjalanan.
          </p>
        </div>

        <button
          onClick={() => {
            setEditId('')
            setForm(trains[0] ? { ...empty, keretaId: trains[0].id } : empty)
            setShow(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-[#121b2d]/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/50">
                <th className="p-4 pl-6">Nama Kereta</th>
                <th className="p-4">Rute Perjalanan</th>
                <th className="p-4">Waktu Berangkat / Tiba</th>
                <th className="p-4">Harga Tiket</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Memuat data jadwal...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    Belum ada jadwal yang terdaftar.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-800/30">
                    {/* Kereta */}
                    <td className="p-4 pl-6 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-cyan-400" />
                        {item.kereta?.nama || 'Tidak Diketahui'}
                      </div>
                    </td>

                    {/* Rute */}
                    <td className="p-4 text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.asal}</span>
                        <ArrowRight className="h-3 w-3 text-slate-500" />
                        <span className="font-medium">{item.tujuan}</span>
                      </div>
                    </td>

                    {/* Waktu */}
                    <td className="p-4 text-xs text-slate-400">
                      <div>Berangkat: <span className="text-slate-200 font-medium">{formatDate(item.tanggalBerangkat)}</span></div>
                      <div className="mt-0.5">Tiba: <span className="text-slate-200 font-medium">{formatDate(item.tanggalTiba)}</span></div>
                    </td>

                    {/* Harga */}
                    <td className="p-4 font-semibold text-cyan-400">
                      {formatRupiah(item.harga)}
                    </td>

                    {/* Aksi */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => edit(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 transition hover:bg-amber-500 hover:text-slate-950"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Dialog */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-400" />
                {editId ? 'Ubah Detail Jadwal' : 'Tambah Jadwal Baru'}
              </h2>
              <button
                onClick={() => setShow(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content / Form */}
            <div className="space-y-4">
              
              {/* Select Kereta */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Pilih Armada Kereta
                </label>
                <select
                  value={form.keretaId}
                  onChange={(e) => setForm({ ...form, keretaId: e.target.value })}
                  className="w-full h-11 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {trains.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid Asal & Tujuan */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" /> Stasiun Asal
                  </label>
                  <input
                    placeholder="Contoh: Jakarta Gambir"
                    value={form.asal}
                    onChange={(e) => setForm({ ...form, asal: e.target.value })}
                    className="w-full h-11 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" /> Stasiun Tujuan
                  </label>
                  <input
                    placeholder="Contoh: Surabaya Pasar Turi"
                    value={form.tujuan}
                    onChange={(e) => setForm({ ...form, tujuan: e.target.value })}
                    className="w-full h-11 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid Waktu Berangkat & Tiba */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Waktu Keberangkatan
                  </label>
                  <input
                    type="datetime-local"
                    value={form.tanggalBerangkat}
                    onChange={(e) => setForm({ ...form, tanggalBerangkat: e.target.value })}
                    className="w-full h-11 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Perkiraan Waktu Tiba
                  </label>
                  <input
                    type="datetime-local"
                    value={form.tanggalTiba}
                    onChange={(e) => setForm({ ...form, tanggalTiba: e.target.value })}
                    className="w-full h-11 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Input Harga */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-slate-500" /> Harga Tiket Base (Rp)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.harga || ''}
                  onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
                  className="w-full h-11 rounded-xl border border-slate-800 bg-[#121b2d] px-4 text-sm text-white transition placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons inside Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="h-11 rounded-xl border border-slate-800 px-5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  onClick={submit}
                  className="h-11 rounded-xl bg-cyan-400 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-95"
                >
                  Simpan Jadwal
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
