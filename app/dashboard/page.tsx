import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-[#020817] text-white min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#020817]/80 backdrop-blur-md border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold">
              🚆
            </div>

            <h1 className="text-2xl font-bold">
              Rail<span className="text-cyan-400">Ticket</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <a href="#home" className="hover:text-cyan-400">
              Beranda
            </a>

            <a href="#kereta" className="hover:text-cyan-400">
              Kereta
            </a>

            <a href="#fitur" className="hover:text-cyan-400">
              Fitur
            </a>

            <a href="#cara" className="hover:text-cyan-400">
              Cara Pemesanan
            </a>
          </nav>

          <div className="flex gap-3">
            <Link href="/login">
              <button className="px-6 py-3 rounded-xl border border-cyan-500/20 hover:border-cyan-400">
                Masuk
              </button>
            </Link>

            <Link href="/signup">
              <button className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400">
                Daftar
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="min-h-screen flex items-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-[#010818]/80"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <span className="inline-block px-5 py-2 rounded-full border border-cyan-500/30 text-cyan-400">
            Sistem Pemesanan Tiket Kereta Indonesia
          </span>

          <h1 className="mt-8 text-7xl font-bold">
            RailTrack
            <br />
            <span className="text-cyan-400">Booking Platform</span>
          </h1>

          <p className="mt-8 text-xl text-gray-300 max-w-2xl">
            Cari jadwal perjalanan, pilih kursi, pesan tiket, dan nikmati
            pengalaman perjalanan kereta yang modern, cepat, dan aman.
          </p>

          <div className="flex gap-4 mt-10">
            <Link href="/login">
              <button className="px-10 py-5 rounded-2xl bg-cyan-500 text-black font-bold">
                Pesan Sekarang
              </button>
            </Link>

            <a href="#kereta">
              <button className="px-10 py-5 rounded-2xl border border-white/20 bg-white/10">
                Lihat Kereta
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Kereta */}
      <section id="kereta" className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-cyan-400 font-semibold tracking-widest uppercase">
            Armada Terintegrasi
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Daftar Kereta
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              "Argo Bromo Anggrek",
              "Taksaka",
              "Bima",
            ].map((train) => (
              <div
                key={train}
                className="p-8 rounded-3xl border border-cyan-500/10 bg-[#071225]"
              >
                <h3 className="text-2xl font-bold">{train}</h3>

                <p className="text-gray-400 mt-4">
                  Kereta eksekutif dengan fasilitas modern dan perjalanan
                  nyaman.
                </p>

                <button className="mt-6 px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold">
                  Lihat Jadwal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section
        id="fitur"
        className="py-32 border-t border-cyan-500/10"
      >
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-cyan-400 font-semibold tracking-widest uppercase">
            Arsitektur Fitur
          </p>

          <h2 className="text-center text-6xl font-bold mt-6">
            Eksplorasi Fitur Utama
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mt-20">
            {[
              {
                title: "Cari Jadwal",
                desc: "Pencarian rute dan jadwal keberangkatan secara real-time.",
              },
              {
                title: "Pilih Kursi",
                desc: "Visualisasi denah gerbong interaktif untuk memilih kursi.",
              },
              {
                title: "Pesan Tiket",
                desc: "Pemesanan instan dengan validasi otomatis.",
              },
              {
                title: "Cetak Nota",
                desc: "Unduh invoice dan tiket digital resmi.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-3xl border border-cyan-500/10 bg-[#071225]"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-3xl text-cyan-400">
                  ✦
                </div>

                <h3 className="mt-8 text-3xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-5 text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Pemesanan */}
      <section
        id="cara"
        className="py-32 border-t border-cyan-500/10"
      >
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-cyan-400 uppercase tracking-widest font-semibold">
            Cara Pemesanan
          </p>

          <h2 className="text-5xl font-bold mt-6">
            Langkah Pemesanan Tiket
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mt-16">
            {[
              "Cari Jadwal",
              "Pilih Kereta",
              "Isi Data Penumpang",
              "Bayar & Cetak Tiket",
            ].map((step, index) => (
              <div
                key={step}
                className="bg-[#071225] p-8 rounded-3xl border border-cyan-500/10"
              >
                <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto">
                  {index + 1}
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}