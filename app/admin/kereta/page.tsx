"use client";

import { useEffect, useState } from "react";
import { Plus, Train } from "lucide-react";
import AdminShell from "../components/AdminShell";
import { ApiKereta, getKereta, createKereta} from "../../lib/api";

function getTrainName(train: ApiKereta) {
  return train.namaKereta || train.nama_kereta || train.nama || train.name || "-";
}

function getTrainCode(train: ApiKereta) {
  return train.kodeKereta || train.kode_kereta || train.kode || train.id;
}

function getTrainClass(train: ApiKereta) {
  return train.kelas || train.className || "-";
}

export default function AdminKeretaPage() {
  const [trains, setTrains] = useState<ApiKereta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Tambah Kereta
  const [showModal, setShowModal] = useState(false);
  const [namaKereta, setNamaKereta] = useState("");
  const [kodeKereta, setKodeKereta] = useState("");
  const [kelas, setKelas] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTrains() {
      try {
        setLoading(true);
        const data = await getKereta();

        if (mounted) {
          setTrains(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data kereta."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTrains();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleTambahKereta() {
    try {
      if (!namaKereta || !kodeKereta || !kelas) {
        alert("Semua field harus diisi.");
        return;
      }

      const response = await fetch("https://trainsystem-production.up.railway.app/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namaKereta,
          kodeKereta,
          kelas,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambah data kereta");
      }

      const newTrain = await response.json();

      setTrains((prev) => [...prev, newTrain]);

      setNamaKereta("");
      setKodeKereta("");
      setKelas("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambah kereta.");
    }
  }

  return (
    <AdminShell title="Data Kereta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[38px] font-extrabold leading-tight text-white">
            Data Kereta
          </h1>
          <p className="mt-3 text-[21px] text-[#8fb5df]">
            Kelola armada kereta yang tersedia.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex h-12 items-center gap-3 rounded-[16px] bg-[#15b8d2] px-5 font-bold text-black transition hover:bg-[#27cce6]"
        >
          <Plus className="h-5 w-5" />
          Tambah Kereta
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-[18px] border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mt-10 overflow-hidden rounded-[18px] border border-[#24344f] bg-[#121b2d]">
        <table className="w-full">
          <thead className="border-b border-[#24344f] text-left text-[#8fb5df]">
            <tr>
              <th className="px-6 py-4 font-semibold">Kereta</th>
              <th className="px-6 py-4 font-semibold">Kode</th>
              <th className="px-6 py-4 font-semibold">Kelas</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={4}>
                  Memuat data kereta...
                </td>
              </tr>
            ) : trains.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={4}>
                  Belum ada data kereta dari backend.
                </td>
              </tr>
            ) : (
              trains.map((train) => (
                <tr
                  key={train.id}
                  className="border-b border-[#1d2b44] last:border-0"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#07304a] text-[#06d5f2]">
                        <Train className="h-5 w-5" />
                      </div>

                      <span className="font-semibold text-white">
                        {getTrainName(train)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {getTrainCode(train)}
                  </td>

                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {getTrainClass(train)}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-[#07304a] px-3 py-1 text-sm font-semibold text-[#06d5f2]">
                      {train.status || "Aktif"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Kereta */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-[#121b2d] p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Tambah Kereta
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama Kereta"
                value={namaKereta}
                onChange={(e) => setNamaKereta(e.target.value)}
                className="w-full rounded-lg border border-[#24344f] bg-[#0f172a] px-4 py-3 text-white outline-none"
              />

              <input
                type="text"
                placeholder="Kode Kereta"
                value={kodeKereta}
                onChange={(e) => setKodeKereta(e.target.value)}
                className="w-full rounded-lg border border-[#24344f] bg-[#0f172a] px-4 py-3 text-white outline-none"
              />

              <input
                type="text"
                placeholder="Kelas"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full rounded-lg border border-[#24344f] bg-[#0f172a] px-4 py-3 text-white outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-slate-600 px-4 py-2 text-white"
              >
                Batal
              </button>

              <button
                onClick={handleTambahKereta}
                className="rounded-lg bg-[#15b8d2] px-4 py-2 font-semibold text-black"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}