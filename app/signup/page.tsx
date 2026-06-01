"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, User, Eye } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#020817] flex">
      {/* Left Side */}
      <div className="relative hidden lg:flex w-1/2 overflow-hidden">
        <Image
          src="/train-bg.jpg"
          alt="Train"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#08142e]/60 to-[#020817]/90" />

        <div className="absolute inset-0 p-16 flex flex-col justify-between">
          {/* Logo */}
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-[#07152d]/80 px-5 py-3 backdrop-blur-xl">
              <span className="text-cyan-400 text-xl">🚆</span>
              <span className="font-bold text-white text-2xl">
                RailTicket
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-xl">
            <h1 className="text-6xl font-extrabold leading-tight text-white">
              Bergabung Bersama
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                RailTicket
              </span>
            </h1>

            <p className="mt-8 text-2xl leading-relaxed text-slate-300">
              Dapatkan akses penuh untuk kemudahan pemesanan,
              pemantauan jadwal, dan manajemen kursi kereta
              secara digital.
            </p>
          </div>

          {/* Footer */}
          <p className="text-slate-500">
            © 2026 RailTicket Core Engine. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-xl">
          <Link
            href="/login"
            className="mb-10 flex items-center gap-3 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>

          <div className="rounded-3xl border border-slate-800 bg-[#07152d]/80 p-10 backdrop-blur-xl">
            {/* Username */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-slate-400">
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Masukkan username"
                  className="h-14 w-full rounded-2xl border border-slate-700 bg-[#020817] pl-12 pr-4 text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  placeholder="Masukkan password"
                  className="h-14 w-full rounded-2xl border border-slate-700 bg-[#020817] pl-12 pr-12 text-white outline-none focus:border-cyan-500"
                />

                <Eye
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Button */}
            <button className="h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white transition hover:opacity-90">
              Daftar
            </button>
          </div>

          <p className="mt-8 text-center text-slate-400">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}