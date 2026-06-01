"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { ApiPelanggan, getAuthToken, getPelanggan } from "../../lib/api";

export default function AdminPelangganPage() {
  const [passengers, setPassengers] = useState<ApiPelanggan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPassengers() {
      try {
        setLoading(true);
        const token = getAuthToken();

        if (!token) {
          throw new Error("Login diperlukan untuk melihat data penumpang.");
        }

        const data = await getPelanggan(token);

        if (mounted) {
          setPassengers(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data penumpang."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPassengers();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminShell title="Data Penumpang">
      <h1 className="text-[38px] font-extrabold leading-tight text-white">
        Data Penumpang
      </h1>
      <p className="mt-3 text-[21px] text-[#8fb5df]">
        Kelola data penumpang dan tiket perjalanan.
      </p>

      {error ? (
        <div className="mt-6 rounded-[18px] border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 text-yellow-100">
          {error}
        </div>
      ) : null}

      <div className="mt-10 overflow-hidden rounded-[18px] border border-[#24344f] bg-[#121b2d]">
        <table className="w-full">
          <thead className="border-b border-[#24344f] text-left text-[#8fb5df]">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama</th>
              <th className="px-6 py-4 font-semibold">NIK</th>
              <th className="px-6 py-4 font-semibold">Telepon</th>
              <th className="px-6 py-4 font-semibold">Username</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={4}>
                  Memuat data penumpang...
                </td>
              </tr>
            ) : passengers.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={4}>
                  Belum ada data penumpang yang bisa ditampilkan.
                </td>
              </tr>
            ) : (
              passengers.map((passenger) => (
                <tr
                  key={passenger.id}
                  className="border-b border-[#1d2b44] last:border-0"
                >
                  <td className="px-6 py-5 font-semibold text-white">
                    {passenger.nama || "-"}
                  </td>
                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {passenger.nik || "-"}
                  </td>
                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {passenger.telp || "-"}
                  </td>
                  <td className="px-6 py-5 text-[#06d5f2]">
                    {passenger.user?.username || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
