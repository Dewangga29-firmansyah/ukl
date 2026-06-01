'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  Home,
  Search,
  Ticket,
  User,
  LogOut,
  Train,
  Menu,
  X,
} from 'lucide-react'

import { useState } from 'react'

const menus = [
  {
    title: 'Dashboard',
    href: '/pelanggan',
    icon: Home,
  },
  {
    title: 'Cari Tiket',
    href: '/pelanggan/cari-tiket',
    icon: Search,
  },
  {
    title: 'Tiket Saya',
    href: '/pelanggan/tiket',
    icon: Ticket,
  },
]

export default function PenumpangLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    router.replace('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-72 shrink-0
          border-r border-slate-800
          bg-slate-900
          transition-transform duration-300
          lg:relative lg:translate-x-0
          ${
            open
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Train size={22} />
            </div>

            <div>
              <h2 className="font-bold text-lg">
                RailTicket
              </h2>

              <p className="text-xs text-slate-400">
                Penumpang
              </p>
            </div>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100vh-80px)] flex-col justify-between">
          <nav className="space-y-2 p-4">
            {menus.map((menu) => {
              const Icon = menu.icon

              const active =
                pathname === menu.href

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    active
                      ? 'bg-cyan-500 font-semibold text-slate-950'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  {menu.title}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500/20"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>

            <div>
              <h1 className="font-bold text-xl">
                Dashboard Penumpang
              </h1>

              <p className="text-sm text-slate-400">
                Selamat datang kembali
              </p>
            </div>
          </div>

          <div className="hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
            P
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}