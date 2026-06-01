"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import {
  ApiPembelian,
  formatRupiah,
  getAuthToken,
  getPembelian,
} from "../../lib/api";

function getOrderCode(order: ApiPembelian) {
  return order.kodePembelian || order.kode || order.id;
}

function getOrderPassenger(order: ApiPembelian) {
  return order.pelanggan?.nama || order.pelanggan?.user?.username || "-";
}

export default function AdminPembelianPage() {
  const [orders, setOrders] = useState<ApiPembelian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      try {
        setLoading(true);
        const token = getAuthToken();

        if (!token) {
          throw new Error("Login diperlukan untuk melihat data pemesanan.");
        }

        const data = await getPembelian(token);

        if (mounted) {
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data pemesanan."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminShell title="Pemesanan">
      <h1 className="text-[38px] font-extrabold leading-tight text-white">
        Pemesanan
      </h1>
      <p className="mt-3 text-[21px] text-[#8fb5df]">
        Pantau transaksi pembelian tiket kereta.
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
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Penumpang</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={4}>
                  Memuat data pemesanan...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={4}>
                  Belum ada data pemesanan yang bisa ditampilkan.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#1d2b44] last:border-0"
                >
                  <td className="px-6 py-5 font-semibold text-white">
                    {getOrderCode(order)}
                  </td>
                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {getOrderPassenger(order)}
                  </td>
                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {formatRupiah(order.totalBayar ?? order.total)}
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-[#07304a] px-3 py-1 text-sm font-semibold text-[#06d5f2]">
                      {order.status || "-"}
                    </span>
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
