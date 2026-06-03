'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import {
  Loader2,
  Train,
  User,
  Armchair,
  ArrowRight,
  Calendar,
  TicketCheck,
  Trash2,
} from 'lucide-react'

import {
  API_URL,
  getAuthToken,
} from '@/app/lib/api'

type Kursi = {
  id: string
  label: string
  status?: string // 'TERISI' atau 'BOOKED'
}

type Gerbong = {
  id: string
  nama: string
  kelas: string
  kursi?: Kursi[]
}

type Jadwal = {
  id: string
  asal: string
  tujuan: string
  harga: number
  tanggalBerangkat: string
  kereta: {
    nama: string
    gerbong?: Gerbong[]
  }
}

type PenumpangInput = {
  kursiId: string
  labelKursi: string
  namaPenumpang: string
}

export default function Page() {
  const router = useRouter()
  const params = useParams()
  const jadwalId = params.jadwalId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [jadwal, setJadwal] = useState<Jadwal | null>(null)
  const [activeGerbong, setActiveGerbong] = useState('')
  const [penumpangList, setPenumpangList] = useState<PenumpangInput[]>([])

  async function load() {
    try {
      const res = await fetch(`${API_URL}/jadwal/${jadwalId}`, {
        cache: 'no-store',
      })
      const data = await res.json()

      setJadwal({
        ...data,
        kereta: {
          ...data.kereta,
          gerbong: data?.kereta?.gerbong || [],
        },
      })

      setActiveGerbong(
        data?.kereta?.gerbong?.[0]?.id || ''
      )
    } catch {
      alert('Gagal memuat jadwal rute perjalanan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (jadwalId) {
      load()
    }
  }, [jadwalId])

  function selectKursi(id: string, label: string) {
    setPenumpangList((prev) => {
      const exist = prev.find((p) => p.kursiId === id)

      if (exist) {
        return prev.filter((p) => p.kursiId !== id)
      }

      return [
        ...prev,
        {
          kursiId: id,
          labelKursi: label,
          namaPenumpang: '', // State awal string kosong
        },
      ]
    })
  }

  function changeNama(id: string, value: string) {
    setPenumpangList((prev) =>
      prev.map((p) =>
        p.kursiId === id
          ? { ...p, namaPenumpang: value } // ✅ Tetap konsisten dengan tipe data
          : p
      )
    )
  }

  async function submit() {
    try {
      if (!penumpangList.length) {
        return alert('Silakan pilih minimal satu nomor kursi terlebih dahulu')
      }

      const kosong = penumpangList.some((p) => !p.namaPenumpang.trim())
      if (kosong) {
        return alert('Mohon isi semua nama penumpang sesuai kartu identitas')
      }

      setSaving(true)
      const token = getAuthToken()

      const payload = {
        jadwalId: String(jadwalId),
        penumpang: penumpangList.map((p) => ({
          namaPenumpang: p.namaPenumpang,
          kursiId: String(p.kursiId),
        })),
      }

      const res = await fetch(`${API_URL}/pembelian`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      let data

      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(text)
      }

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join('\n')
            : data.message
        )
      }

      router.push(`/pelanggan/pembayaran?id=${data.id}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan sistem internal')
    } finally {
      setSaving(false)
    }
  }

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <Loader2 className="animate-spin text-cyan-400 h-8 w-8 mx-auto" />
          <p className="text-sm text-slate-400 tracking-wide">Menyelaraskan peta kursi...</p>
        </div>
      </div>
    )
  }

  const gerbong = jadwal?.kereta.gerbong?.find((g) => g.id === activeGerbong)

  return (
    <div className="space-y-6">
      {/* Route Info Banner */}
      <div className="border-b border-slate-800/60 pb-5">
        <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
          <span>{jadwal?.asal}</span>
          <ArrowRight className="text-slate-500 h-6 w-6 shrink-0" />
          <span>{jadwal?.tujuan}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          {formatDateTime(jadwal?.tanggalBerangkat)} WIB
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Columns: Compartments & Manifest Inputs */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Coach & Seat Selection Box */}
          <div className="rounded-2xl border border-slate-800 bg-[#121b2d]/40 p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Pilih Kompartemen Gerbong</h2>
            
            {/* Coach Tab Selectors */}
            <div className="flex flex-wrap gap-2">
              {jadwal?.kereta.gerbong?.map((g) => {
                const isActive = activeGerbong === g.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGerbong(g.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950 border-cyan-400 shadow-md shadow-cyan-400/10'
                        : 'bg-[#0f172a] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {g.nama} <span className="opacity-60 font-medium">({g.kelas})</span>
                  </button>
                )
              })}
            </div>

            {/* Legend Indicators */}
            <div className="flex gap-4 text-[11px] font-medium text-slate-400 mt-6 mb-4 justify-end">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-[#0f172a] border border-slate-800 block" /> Tersedia
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-cyan-400 block" /> Terpilih
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-red-500/20 border border-red-500/30 block" /> Terisi (Locked)
              </div>
            </div>

            {/* Seat Map Grid Layout */}
            <div className="grid grid-cols-4 gap-3 bg-[#0f172a]/40 p-4 rounded-xl border border-slate-800/50">
              {gerbong?.kursi?.map((seat) => {
                const active = penumpangList.some((p) => p.kursiId === seat.id)
                
                // Normalisasi string huruf besar/kecil untuk mengunci tombol jika status dari database terisi
                const isOccupied = 
                  seat.status?.toUpperCase() === 'TERISI' || 
                  seat.status?.toUpperCase() === 'BOOKED'

                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => selectKursi(seat.id, seat.label)}
                    className={`h-12 flex items-center justify-center gap-1 rounded-xl text-xs font-bold border tracking-wide transition duration-150 ${
                      isOccupied
                        ? 'bg-red-500/20 text-red-400/40 border-red-500/30 cursor-not-allowed line-through'
                        : active
                        ? 'bg-cyan-400 text-slate-950 border-cyan-400 shadow-md shadow-cyan-400/10'
                        : 'bg-[#0f172a] text-slate-100 border-slate-800/80 hover:border-slate-700 hover:bg-[#121b2d]'
                    }`}
                  >
                    <Armchair className="h-3.5 w-3.5 shrink-0" />
                    <span>{seat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dynamic Passenger Manifest Forms */}
          <div className="rounded-2xl border border-slate-800 bg-[#121b2d]/40 p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-400" /> Informasi Identitas Penumpang
            </h2>

            {penumpangList.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-2">
                Belum ada kursi yang dipilih. Ketuk nomor kursi di atas untuk menambahkan data penumpang.
              </p>
            ) : (
              <div className="space-y-3">
                {penumpangList.map((p) => (
                  <div
                    key={p.kursiId}
                    className="flex items-center gap-3 bg-[#0f172a]/60 p-3 rounded-xl border border-slate-800/80"
                  >
                    <div className="w-16 h-11 flex items-center justify-center shrink-0 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-400">
                      {p.labelKursi}
                    </div>

                    <input
                      type="text"
                      value={p.namaPenumpang} // ✅ Diperbaiki dari namaPassenger
                      onChange={(e) => changeNama(p.kursiId, e.target.value)}
                      placeholder={`Nama penumpang kursi ${p.labelKursi}`}
                      className="h-11 flex-1 rounded-xl bg-[#090d16] border border-slate-800 px-4 text-sm text-white transition placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => selectKursi(p.kursiId, p.labelKursi)}
                      className="text-slate-500 hover:text-red-400 p-2 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Checkout Invoice Panel (Sticky Layout) */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl lg:sticky lg:top-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <TicketCheck className="h-5 w-5 text-cyan-400" /> Ringkasan Pembayaran
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Kuantitas Pembelian</span>
              <span className="text-slate-200 font-medium">{penumpangList.length} Tiket</span>
            </div>
            
            <div className="flex justify-between text-slate-400">
              <span>Tarif Tiket Per Kursi</span>
              <span className="text-slate-200 font-medium">Rp {(jadwal?.harga || 0).toLocaleString('id-ID')}</span>
            </div>

            <div className="border-t border-slate-800/80 pt-4 mt-4 flex items-center justify-between">
              <span className="font-bold text-white text-base">Total Biaya</span>
              <span className="font-black text-2xl text-cyan-400">
                Rp {(penumpangList.length * (jadwal?.harga || 0)).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={saving || !penumpangList.length}
            className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses Pesanan...</span>
              </>
            ) : (
              <span>Konfirmasi & Bayar</span>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}