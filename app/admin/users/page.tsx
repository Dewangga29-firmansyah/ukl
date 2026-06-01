"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { ApiGerbong, ApiKereta, getKereta } from "../../lib/api";

type CarriageSummary = {
  id: string;
  carriage: string;
  train: string;
  type: string;
  seats: number;
  available: number;
};

function getTrainName(train: ApiKereta) {
  return train.namaKereta || train.nama_kereta || train.nama || train.name || "-";
}

function getCarriageName(carriage: ApiGerbong, index: number) {
  return (
    carriage.namaGerbong ||
    carriage.nama_gerbong ||
    carriage.nama ||
    carriage.kode ||
    `Gerbong ${carriage.nomor || index + 1}`
  );
}

function summarizeCarriages(trains: ApiKereta[]) {
  return trains.flatMap((train) => {
    const carriages = train.gerbong || train.gerbongs || [];

    return carriages.map((carriage, index) => {
      const seats = carriage.kursi || [];
      const available = seats.filter((seat) => {
        const status = seat.status?.toLowerCase();
        return !status || status === "available" || status === "tersedia";
      }).length;

      return {
        id: carriage.id,
        carriage: getCarriageName(carriage, index),
        train: getTrainName(train),
        type: carriage.kelas || train.kelas || "-",
        seats: carriage.kapasitas || seats.length || 0,
        available,
      };
    });
  });
}

export default function AdminUsersPage() {
  const [seats, setSeats] = useState<CarriageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCarriages() {
      try {
        setLoading(true);
        const trains = await getKereta();

        if (mounted) {
          setSeats(summarizeCarriages(trains));
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data gerbong dan kursi."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCarriages();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminShell title="Gerbong & Kursi">
      <h1 className="text-[38px] font-extrabold leading-tight text-white">
        Gerbong & Kursi
      </h1>
      <p className="mt-3 text-[21px] text-[#8fb5df]">
        Pantau kapasitas gerbong dan ketersediaan kursi.
      </p>

      {error ? (
        <div className="mt-6 rounded-[18px] border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10 rounded-[18px] border border-[#24344f] bg-[#121b2d] p-7 text-[#8fb5df]">
          Memuat data gerbong dan kursi...
        </div>
      ) : seats.length === 0 ? (
        <div className="mt-10 rounded-[18px] border border-[#24344f] bg-[#121b2d] p-7 text-[#8fb5df]">
          Belum ada data gerbong dan kursi dari backend.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-[30px] md:grid-cols-3">
          {seats.map((item) => (
            <article
              key={item.id}
              className="rounded-[18px] border border-[#24344f] bg-[#121b2d] p-7"
            >
              <p className="text-lg font-semibold text-white">
                {item.carriage}
              </p>
              <p className="mt-1 text-[#8fb5df]">{item.train}</p>
              <p className="mt-1 text-sm text-[#c9d7ee]">{item.type}</p>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-sm text-[#8fb5df]">Kursi Tersedia</p>
                  <strong className="mt-2 block text-4xl font-extrabold">
                    {item.available}
                  </strong>
                </div>
                <p className="text-[#c9d7ee]">dari {item.seats}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
