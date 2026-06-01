import {
  ArrowRight,
  Calendar,
  Clock3,
  MapPin,
  ShieldCheck,
  Ticket,
  Train,
  ArrowLeftRight,
  Search,
  Star,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070b19] text-white selection:bg-blue-500 selection:text-white font-sans antialiased overflow-x-hidden">

      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[60vh] right-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#070b19]/70 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Train size={24} className="animate-pulse" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Rail<span className="from-blue-400 to-indigo-400 bg-gradient-to-r bg-clip-text text-transparent">Nusantara</span>
            </span>
          </div>

          <div className="hidden gap-10 text-sm font-semibold tracking-wide text-zinc-400 md:flex">
            <a href="#" className="text-white relative after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-blue-500 after:rounded-full">Beranda</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Jadwal</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Promo</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Layanan VIP</a>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Masuk
            </Link>

            <Link
              href="/signup"
              className="relative group overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold shadow-lg shadow-blue-600/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-600/30 block"
            >
              <span className="relative z-10">Daftar Sekarang</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-indigo-600 to-blue-600 transition-transform duration-300 ease-out" />
            </Link>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-8">
        <div className="grid min-h-[85vh] items-center gap-12 lg:grid-cols-12">

          {/* Left Column: Copy & Search Form */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            <div className="mb-6 inline-flex self-start items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-blue-400 backdrop-blur-md">
              <Star size={14} className="fill-blue-400/20" /> Standard Kemewahan Baru Transparansi Rail
            </div>

            <h1 className="text-5xl font-black tracking-tight leading-[1.1] md:text-7xl">
              Jelajahi Nusantara <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Tanpa Batas.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Nikmati pengalaman perjalanan kereta kelas dunia dengan kenyamanan paripurna, ketepatan waktu mutlak, dan sistem reservasi tercanggih.
            </p>

            {/* Premium Booking Widget */}
            <div className="mt-10 rounded-[32px] border border-white/5 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
              <div className="flex items-center gap-6 mb-6 pb-4 border-b border-white/5 text-sm font-medium text-zinc-400">
                <button className="text-blue-400 border-b-2 border-blue-500 pb-4 -mb-[18px]">Sekali Jalan</button>
                <button className="hover:text-white transition-colors pb-4">Pulang Pergi</button>
                <button className="hover:text-white transition-colors pb-4 flex items-center gap-1.5"><Users size={14} /> Luxury Lounge</button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative group">
                  <label className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-blue-400 transition-colors">Asal</label>
                  <div className="absolute top-7 left-4 text-zinc-400"><MapPin size={18} /></div>
                  <input
                    placeholder="Jakarta Gambir (GMR)"
                    className="w-full rounded-2xl border border-white/5 bg-zinc-950/60 pt-7 pb-3 pl-12 pr-4 text-sm font-semibold outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div className="relative group">
                  <label className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-blue-400 transition-colors">Tujuan</label>
                  <div className="absolute top-7 left-4 text-zinc-400"><MapPin size={18} /></div>
                  <input
                    placeholder="Yogyakarta Tugu (YK)"
                    className="w-full rounded-2xl border border-white/5 bg-zinc-950/60 pt-7 pb-3 pl-12 pr-4 text-sm font-semibold outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-800 p-2 rounded-xl border border-white/5 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeftRight size={14} />
                  </button>
                </div>

                <div className="relative group">
                  <label className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-blue-400 transition-colors">Tanggal Keberangkatan</label>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-white/5 bg-zinc-950/60 pt-7 pb-3 px-4 text-sm font-semibold outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-zinc-300 [color-scheme:dark]"
                  />
                </div>

                <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm">
                  <Search size={18} /> Cari Penerbangan & Kereta
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Visual Ticket Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full scale-75 pointer-events-none" />

            <div className="relative w-full max-w-[420px] rounded-[40px] border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-8 shadow-2xl backdrop-blur-xl group hover:border-white/20 transition-all duration-500">

              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-blue-500 text-[10px] tracking-widest font-black uppercase px-4 py-1.5 rounded-full shadow-md shadow-blue-500/20">
                Luxury Class
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Rute Terpopuler</p>
                    <h3 className="text-2xl font-extrabold mt-1 tracking-tight">Surabaya → Jakarta</h3>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-blue-400">
                    <Train size={28} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center gap-3">
                    <div className="text-blue-400"><Calendar size={20} /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-500">Tanggal</p>
                      <p className="text-xs font-bold text-zinc-200 mt-0.5">12 Juni 2026</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center gap-3">
                    <div className="text-blue-400"><Clock3 size={20} /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-500">Waktu</p>
                      <p className="text-xs font-bold text-zinc-200 mt-0.5">07:30 WIB</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Aesthetic Line Spacer */}
                <div className="relative flex items-center justify-between py-2">
                  <div className="absolute left-[-41px] w-6 h-6 bg-[#070b19] rounded-full border-r border-white/10" />
                  <div className="w-full border-b-2 border-dashed border-white/10" />
                  <div className="absolute right-[-41px] w-6 h-6 bg-[#070b19] rounded-full border-l border-white/10" />
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tarif Eksklusif</p>
                    <h2 className="text-3xl font-black mt-1 text-white tracking-tight">
                      Rp1.250<span className="text-lg font-medium text-zinc-400">K</span>
                    </h2>
                  </div>
                  <button className="p-4 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-500/20 group-hover:translate-x-1 transition-all">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-32 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold tracking-widest text-blue-500 uppercase">Layanan Istimewa</h2>
          <p className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Mengapa Memilih RailNusantara?
          </p>
          <p className="mt-4 text-zinc-400 text-lg">
            Kami mendefinisikan ulang arti perjalanan kereta modern dengan standard kenyamanan tertinggi.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Ticket,
              title: 'Ultra-Fast Booking',
              desc: 'Sistem alokasi kursi pintar terintegrasi. Selesaikan reservasi mewah Anda dalam waktu kurang dari 30 detik tanpa hambatan.',
            },
            {
              icon: ShieldCheck,
              title: 'Proteksi Enkripsi End-to-End',
              desc: 'Keamanan finansial tingkat perbankan internasional. Data personal dan transaksi Anda sepenuhnya terlindungi secara mutlak.',
            },
            {
              icon: MapPin,
              title: 'Konektivitas Nusantara',
              desc: 'Akses eksklusif ke seluruh rute strategis antarkota utama dengan armada Suite Class dan Luxury terbaru kami.',
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="relative group rounded-[32px] border border-white/5 bg-zinc-900/20 p-8 shadow-xl backdrop-blur-md hover:border-blue-500/30 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-[32px] transition-opacity duration-300 pointer-events-none" />

              <div className="inline-flex rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 p-4 text-blue-400 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <item.icon size={28} />
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mx-6 lg:mx-8 max-w-7xl lg:mx-auto mb-32 relative overflow-hidden rounded-[48px] border border-white/10 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-8 py-24 text-center shadow-2xl shadow-blue-600/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl text-white">
            Mulai Perjalanan Epik Anda
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100 opacity-90 leading-relaxed">
            Bergabunglah bersama jutaan pelanggan VIP yang telah menikmati standard kemewahan transportasi baru di Indonesia.
          </p>
          <button className="mt-10 rounded-full bg-white px-8 py-4.5 font-bold text-zinc-950 shadow-xl shadow-zinc-950/10 hover:bg-zinc-50 hover:scale-[1.03] active:scale-[0.98] transition-all tracking-wide text-sm">
            Reservasi Tiket Sekarang
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#040711] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center justify-between gap-8 md:flex-row">

          <div>
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-blue-500/10 p-1.5 text-blue-400 border border-blue-500/20">
                <Train size={18} />
              </div>
              <span className="font-extrabold tracking-tight text-white">
                Rail<span className="text-blue-400">Nusantara</span>
              </span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              © 2026 RailNusantara Global Layanan Transportasi Utama. All rights reserved.
            </p>
          </div>

          <div className="flex gap-10 text-xs font-medium text-zinc-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Customer Support</a>
          </div>

        </div>
      </footer>

    </div>
  )
}
