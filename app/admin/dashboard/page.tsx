"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Ticket, Train, Users } from "lucide-react";
import AdminShell from "../components/AdminShell";
import {
  ApiPembelian,
  formatRupiah,
  getAuthToken,
  getJadwal,
  getKereta,
  getPelanggan,
  getPembelian,
} from "../../lib/api";

type DashboardStats = {
  kereta: number;
  jadwal: number;
  pelanggan: number;
  pemasukan: string;
};

const defaultStats: DashboardStats = {
  kereta: 0,
  jadwal: 0,
  pelanggan: 0,
  pemasukan: formatRupiah(0),
};

function getPembelianTotal(order: ApiPembelian) {
  return Number(order.totalBayar ?? order.total ?? 0) || 0;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      const token = getAuthToken();

      const [keretaResult, jadwalResult, pelangganResult, pembelianResult] =
        await Promise.allSettled([
          getKereta(),
          getJadwal(),
          getPelanggan(token),
          getPembelian(token),
        ]);

      if (!mounted) {
        return;
      }

      const pembelian =
        pembelianResult.status === "fulfilled" ? pembelianResult.value : [];

      setStats({
        kereta:
          keretaResult.status === "fulfilled" ? keretaResult.value.length : 0,
        jadwal:
          jadwalResult.status === "fulfilled" ? jadwalResult.value.length : 0,
        pelanggan:
          pelangganResult.status === "fulfilled"
            ? pelangganResult.value.length
            : 0,
        pemasukan: formatRupiah(
          pembelian.reduce((total, order) => total + getPembelianTotal(order), 0)
        ),
      });

      const protectedFailed =
        pelangganResult.status === "rejected" ||
        pembelianResult.status === "rejected";

      setMessage(
        protectedFailed
          ? "Login diperlukan untuk melihat data pelanggan dan pemasukan."
          : null
      );
      setLoading(false);
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    {
      title: "Total Kereta",
      value: loading ? "..." : String(stats.kereta),
      icon: Train,
    },
    {
      title: "Total Jadwal",
      value: loading ? "..." : String(stats.jadwal),
      icon: CalendarDays,
    },
    {
      title: "Total Pelanggan",
      value: loading ? "..." : String(stats.pelanggan),
      icon: Users,
    },
    {
      title: "Total Pemasukan",
      value: loading ? "..." : stats.pemasukan,
      icon: Ticket,
    },
  ];

  return (
    <AdminShell title="Dashboard Admin">
      <h1 className="text-[38px] font-extrabold leading-tight text-white">
        Dashboard Admin
      </h1>
      <p className="mt-3 text-[21px] text-[#8fb5df]">
        Selamat datang di sistem pemesanan tiket kereta.
      </p>

      {message ? (
        <div className="mt-6 rounded-[18px] border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 text-yellow-100">
          {message}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex min-h-[142px] items-center justify-between rounded-[18px] border border-[#24344f] bg-[#121b2d] px-[30px]"
            >
              <div>
                <p className="text-lg font-medium text-[#8fb5df]">
                  {item.title}
                </p>
                <strong className="mt-3 block text-[38px] font-extrabold leading-none text-white">
                  {item.value}
                </strong>
              </div>

              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px] bg-[#07304a] text-[#06d5f2]">
                <Icon className="h-7 w-7" strokeWidth={2.3} />
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
