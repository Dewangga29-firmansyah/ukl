'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  CalendarDays,
  ChevronRight,
  Search,
  Ticket,
  Train,
  User,
} from 'lucide-react'

import {
  getAuthUser,
} from '../lib/api'

export default function PelangganPage() {
  const [user, setUser] =
    useState<any>(null)

  useEffect(() => {
    setUser(
      getAuthUser()
    )
  }, [])

  return (
    <>

        <section
          className="
          overflow-hidden
          rounded-[40px]
          bg-gradient-to-br
          from-cyan-500
          via-blue-700
          to-[#07101d]
          p-10
        "
        >

          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-cyan-100">
                Dashboard Pelanggan
              </p>

              <h1 className="mt-4 text-5xl font-black text-white">

                Halo,
                {' '}

                {
                  user?.username ||
                  'Penumpang'
                }

                👋

              </h1>

              <p className="mt-5 max-w-xl text-lg text-cyan-100">

                Cari tiket,
                cek perjalanan,
                dan kelola semua
                pemesanan kereta
                dalam satu tempat.

              </p>

              <Link
                href="/jadwal"
                className="
                mt-8
                inline-flex
                h-14
                items-center
                gap-3
                rounded-2xl
                bg-white
                px-7
                font-bold
                text-black
              "
              >

                <Search />

                Cari Tiket

              </Link>

            </div>

            <div
              className="
              rounded-[32px]
              border
              border-white/10
              bg-black/20
              p-8
              backdrop-blur
            "
            >

              <Train
                size={80}
                className="text-cyan-300"
              />

              <p className="mt-5 text-cyan-100">

                Perjalanan Berikutnya

              </p>

              <h3 className="mt-2 text-2xl font-black text-white">

                Belum Ada Tiket

              </h3>

            </div>

          </div>

        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">

          <StatsCard
            title="Total Tiket"
            value="0"
            icon={<Ticket />}
          />

          <StatsCard
            title="Status Akun"
            value="Aktif"
            icon={<User />}
          />

          <StatsCard
            title="Role"
            value="PELANGGAN"
            icon={<Train />}
          />

        </section>

        <section className="mt-10">

          <h2 className="mb-6 text-3xl font-black text-white">

            Menu Cepat

          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <QuickCard
              href="/jadwal"
              title="Cari Jadwal"
              desc="Cari kereta dan pesan tiket"
            />

            <QuickCard
              href="/pembelian"
              title="Tiket Saya"
              desc="Lihat seluruh tiket"
            />

            <QuickCard
              href="/profil"
              title="Profil"
              desc="Kelola akun pelanggan"
            />

          </div>

        </section>

        <section className="mt-10">

          <div
            className="
            rounded-[32px]
            bg-[#111827]
            p-8
          "
          >

            <div className="flex items-center gap-3">

              <CalendarDays
                className="text-cyan-300"
              />

              <h2 className="text-2xl font-black text-white">

                Aktivitas Terakhir

              </h2>

            </div>

            <div
              className="
              mt-8
              rounded-3xl
              border
              border-dashed
              border-[#2a3d5b]
              py-16
              text-center
            "
            >

              <Ticket
                size={56}
                className="mx-auto text-[#3d567f]"
              />

              <h3 className="mt-5 text-xl font-bold text-white">

                Belum Ada Aktivitas

              </h3>

              <p className="mt-2 text-[#7ea2d5]">

                Mulai cari tiket
                untuk perjalananmu.

              </p>

            </div>

          </div>

        </section>

        </>
  )
}

function StatsCard({
  title,
  value,
  icon,
}: any) {
  return (
    <div
      className="
      rounded-[28px]
      bg-[#111827]
      p-7
    "
    >

      <div className="text-cyan-300">

        {icon}

      </div>

      <p className="mt-5 text-[#7ea2d5]">

        {title}

      </p>

      <h3 className="mt-2 text-4xl font-black text-white">

        {value}

      </h3>

    </div>
  )
}

function QuickCard({
  href,
  title,
  desc,
}: any) {
  return (
    <Link
      href={href}
      className="
      rounded-[28px]
      bg-[#111827]
      p-7
      transition
      hover:border
      hover:border-cyan-400
    "
    >

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-xl font-bold text-white">

            {title}

          </h3>

          <p className="mt-2 text-[#7ea2d5]">

            {desc}

          </p>

        </div>

        <ChevronRight className="text-cyan-400" />

      </div>

    </Link>
  )
}