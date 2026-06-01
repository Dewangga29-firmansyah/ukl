"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, User, Eye, Train } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#070b19] flex text-white selection:bg-blue-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Decorative Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Left Side (Visual Panel) */}
      <div className="relative hidden lg:flex w-1/2 overflow-hidden border-r border-white/5">
        <Image
          src="/train-bg.jpg"
          alt="Premium Train Interior"
          fill
          priority
          className="object-cover scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
        />

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/40 via-[#070b19]/80 to-[#070b19]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#070b19]/90" />

        <div className="absolute inset-0 p-16 flex flex-col justify-between z-10">
          {/* Brand Logo */}
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-zinc-900/40 px-5 py-3 backdrop-blur-xl ring-1 ring-white/10">
              <div className="rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-1.5 text-white shadow-lg shadow-blue-500/20">
                <Train size={20} />
              </div>
              <span className="font-extrabold tracking-tight text-white text-xl">
                Rail<span className="from-blue-400 to-indigo-400 bg-gradient-to-r bg-clip-text text-transparent">Nusantara</span>
              </span>
            </div>
          </div>

          {/* Premium Copywriting */}
          <div className="max-w-xl">
            <h1 className="text-5xl font-black tracking-tight leading-[1.15] text-white">
              Mulai Langkah <br /> Kemewahan Anda Bersama <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                RailNusantara
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Dapatkan akses eksklusif untuk kemudahan reservasi Suite Class, pemantauan jadwal real-time, dan manajemen perjalanan VIP Anda dalam satu ketukan.
            </p>
          </div>

          {/* Luxury Footer Sign */}
          <p className="text-xs font-medium tracking-wide text-zinc-600">
            © 2026 RailNusantara Global Layanan Transportasi Utama. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side (Form Panel) */}
      <div className="flex flex-1 items-center justify-center p-8 relative z-10 lg:bg-[#070b19]/40 backdrop-blur-sm">
        <div className="w-full max-w-lg">
          
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2.5 text-sm font-semibold text-zinc-400 transition-colors hover:text-white group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>

          <div className="rounded-[32px] border border-white/5 bg-zinc-900/20 p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight">Buat Akun VIP</h2>
              <p className="text-zinc-400 text-sm mt-2">Daftarkan diri Anda untuk akses layanan standard dunia.</p>
            </div>

            {/* Username Field */}
            <div className="mb-6">
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Username
              </label>

              <div className="relative group">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors"
                />

                <input
                  type="text"
                  placeholder="Masukkan username Anda"
                  className="h-14 w-full rounded-2xl border border-white/5 bg-zinc-950/60 pl-12 pr-4 text-sm font-semibold text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Password
              </label>

              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors"
                />

                <input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  className="h-14 w-full rounded-2xl border border-white/5 bg-zinc-950/60 pl-12 pr-12 text-sm font-semibold text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                />

                <Eye
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 cursor-pointer hover:text-white transition-colors"
                />
              </div>
            </div>

            {/* Premium Submit Button */}
            <button className="relative w-full h-14 group overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold tracking-wide shadow-lg shadow-blue-600/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-600/30">
              <span className="relative z-10">Daftar Akun</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-indigo-600 to-blue-600 transition-transform duration-300 ease-out" />
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-400">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
            >
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}