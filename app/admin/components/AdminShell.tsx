"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Armchair,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  ScanLine,
  Ticket,
  Train,
  Users,
} from "lucide-react";
import { clearAuthSession } from "../../lib/api";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Kereta",
    href: "/admin/kereta",
    icon: Train,
  },
  {
    label: "Gerbong & Kursi",
    href: "/admin/gerbong",
    icon: Armchair,
  },
  {
    label: "Jadwal",
    href: "/admin/jadwal",
    icon: CalendarDays,
  },
  {
    label: "Penumpang",
    href: "/admin/pelanggan",
    icon: Users,
  },
  {
    label: "Pemesanan",
    href: "/admin/pembelian",
    icon: Ticket,
  },
];

type AdminShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AdminShell({
  title,
  subtitle = "Railway Management System",
  children,
}: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#020612] text-white">
      <aside className="flex w-[360px] shrink-0 flex-col border-r border-[#213047] bg-[#111a2b]">
        <div className="flex h-[104px] items-center border-b border-[#213047] px-8">
          <Link href="/admin/dashboard" className="flex items-center gap-4">
            <Train className="h-8 w-8 text-[#12c9e8]" strokeWidth={2.3} />
            <div>
              <h1 className="text-2xl font-extrabold leading-7 text-white">
                RailNusantara
              </h1>
              <p className="mt-1 text-base text-[#93a7c2]">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-5 py-5">
          <div className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-[60px] items-center gap-4 rounded-[20px] px-5 text-xl font-medium transition ${
                    isActive
                      ? "bg-[#15b8d2] text-black"
                      : "text-[#d8e5ff] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#213047] p-5">
          <Link
            href="/login"
            onClick={clearAuthSession}
            className="flex h-[60px] items-center gap-4 rounded-[20px] bg-[#2c1b2e] px-5 text-xl font-medium text-[#ff6464] transition hover:bg-[#3a203b]"
          >
            <LogOut className="h-5 w-5" strokeWidth={2.2} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[104px] items-center justify-between border-b border-[#213047] bg-[#101928] px-[30px]">
          <div>
            <h2 className="text-2xl font-extrabold leading-8 text-white">
              {title}
            </h2>
            <p className="mt-1 text-base text-[#93a7c2]">{subtitle}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#12b9d6] text-lg font-extrabold text-black">
              A
            </div>
            <div>
              <p className="text-xl font-bold leading-6 text-white">
                Administrator
              </p>
              <p className="mt-1 text-base font-medium uppercase text-[#93a7c2]">
                Admin
              </p>
            </div>
          </div>
        </header>

        <section className="flex-1 px-[30px] py-8">{children}</section>
      </main>
    </div>
  );
}
