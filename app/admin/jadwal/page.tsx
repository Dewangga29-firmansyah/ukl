"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { ApiJadwal, getJadwal } from "../../lib/api";

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getTime(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getTrainName(schedule: ApiJadwal) {
  return (
    schedule.kereta?.namaKereta ||
    schedule.kereta?.nama_kereta ||
    schedule.kereta?.nama ||
    schedule.kereta?.name ||
    schedule.keretaId ||
    "-"
  );
}

function getRoute(schedule: ApiJadwal) {
  const asal =
    schedule.asal || schedule.stasiunAsal || schedule.stasiun_asal || "-";
  const tujuan =
    schedule.tujuan || schedule.stasiunTujuan || schedule.stasiun_tujuan || "-";

  return `${asal} - ${tujuan}`;
}

function getScheduleDate(schedule: ApiJadwal) {
  return formatDate(schedule.tanggalBerangkat || schedule.tanggal);
}

function getScheduleTime(schedule: ApiJadwal) {
  const departure = schedule.waktuBerangkat || schedule.jamBerangkat;
  const arrival = schedule.waktuTiba || schedule.jamTiba;

  if (!departure && !arrival) {
    return "-";
  }

  return `${getTime(departure)} - ${getTime(arrival)}`;
}

export default function TrainSchedulePage() {
  const [schedules, setSchedules] = useState<ApiJadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSchedules() {
      try {
        setLoading(true);
        const data = await getJadwal();

        if (mounted) {
          setSchedules(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Gagal mengambil data jadwal."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSchedules();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminShell title="Jadwal">
      <h1 className="text-[38px] font-extrabold leading-tight text-white">
        Jadwal Kereta
      </h1>
      <p className="mt-3 text-[21px] text-[#8fb5df]">
        Atur jadwal keberangkatan dan status perjalanan.
      </p>

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
              <th className="px-6 py-4 font-semibold">Rute</th>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold">Jam</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={5}>
                  Memuat data jadwal...
                </td>
              </tr>
            ) : schedules.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-[#8fb5df]" colSpan={5}>
                  Belum ada data jadwal dari backend.
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-b border-[#1d2b44] last:border-0"
                >
                  <td className="px-6 py-5 font-semibold text-white">
                    {getTrainName(schedule)}
                  </td>
                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {getRoute(schedule)}
                  </td>
                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {getScheduleDate(schedule)}
                  </td>
                  <td className="px-6 py-5 text-[#c9d7ee]">
                    {getScheduleTime(schedule)}
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-[#07304a] px-3 py-1 text-sm font-semibold text-[#06d5f2]">
                      {schedule.status || "Aktif"}
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
