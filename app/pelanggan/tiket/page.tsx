'use client'

import {
    useEffect,
    useState,
} from 'react'

import Link from 'next/link'

import {
    ArrowRight,
    Calendar,
    Loader2,
    Ticket,
    Train,
} from 'lucide-react'

import {
    API_URL,
    getAuthToken,
} from '@/app/lib/api'

type Tiket = {
    id: string
    kodeBooking: string
    total: number
    status: string

    jadwal?: {
        asal: string
        tujuan: string
        tanggalBerangkat: string

        kereta?: {
            nama: string
        }
    }

    detail?: {
        id: string
    }[]
}

export default function Page() {
    const [
        tiket,
        setTiket,
    ] =
        useState<Tiket[]>([])

    const [
        loading,
        setLoading,
    ] =
        useState(true)

    useEffect(() => {
        load()
    }, [])

    async function load() {
        try {
            setLoading(true)

            const token =
                getAuthToken()

            const res =
                await fetch(
                    `${API_URL}/pembelian/mine`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },

                        cache:
                            'no-store',
                    },
                )

            const data =
                await res.json()

            console.log(
                'DATA TIKET:',
                data,
            )

            if (!res.ok) {
                setTiket([])
                return
            }

            setTiket(
                Array.isArray(data)
                    ? data
                    : [],
            )
        } catch (err) {
            console.error(
                err,
            )

            setTiket([])
        } finally {
            setLoading(
                false,
            )
        }
    }

    function statusColor(
        status:
            | string
            | undefined,
    ) {
        if (
            status ===
            'PAID'
        )
            return 'bg-green-500/20 text-green-400'

        if (
            status ===
            'PENDING'
        )
            return 'bg-yellow-500/20 text-yellow-400'

        return 'bg-red-500/20 text-red-400'
    }

    if (
        loading
    ) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            </div>
        )
    }

    return (
        <div className="space-y-8">

            <div>

                <h1 className="text-4xl font-black text-white">
                    Tiket Saya
                </h1>

                <p className="mt-2 text-slate-400">
                    Semua tiket perjalanan Anda
                </p>

            </div>

            {!tiket.length && (
                <div
                    className="
          rounded-3xl
          border
          border-dashed
          border-slate-700
          py-20
          text-center
        "
                >

                    <Ticket
                        size={60}
                        className="
            mx-auto
            mb-5
            text-slate-600
          "
                    />

                    <h2 className="text-2xl font-bold text-white">
                        Belum Ada Tiket
                    </h2>

                    <p className="mt-3 text-slate-500">
                        Pesan perjalanan pertama Anda
                    </p>

                    <Link
                        href="/pelanggan/cari-tiket"
                        className="
            mt-8
            inline-flex
            rounded-xl
            bg-cyan-400
            px-6
            py-3
            font-bold
            text-black
          "
                    >
                        Cari Tiket
                    </Link>

                </div>
            )}

            <div className="grid gap-6">

                {tiket.map(
                    (
                        item,
                    ) => (
                        <div
                            key={
                                item.id
                            }
                            className="
              rounded-[32px]
              border
              border-slate-800
              bg-[#121b2d]
              p-8
            "
                        >

                            <div className="flex justify-between">

                                <div>

                                    <div className="flex items-center gap-3">

                                        <Train className="text-cyan-400" />

                                        <h2 className="text-2xl font-bold text-white">

                                            {
                                                item
                                                    .jadwal
                                                    ?.kereta
                                                    ?.nama
                                            }

                                        </h2>

                                    </div>

                                    <p className="mt-3 text-slate-400">

                                        {
                                            item
                                                .kodeBooking
                                        }

                                    </p>

                                </div>

                                <span
                                    className={`
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-bold
                  ${statusColor(
                                        item.status,
                                    )}
                `}
                                >

                                    {
                                        item.status
                                    }

                                </span>

                            </div>

                            <div className="mt-8 flex items-center gap-4 text-3xl font-black text-white">

                                <span>
                                    {
                                        item
                                            .jadwal
                                            ?.asal
                                    }
                                </span>

                                <ArrowRight />

                                <span>
                                    {
                                        item
                                            .jadwal
                                            ?.tujuan
                                    }
                                </span>

                            </div>

                            <div className="mt-5 flex items-center gap-2 text-slate-400">

                                <Calendar />

                                {item
                                    .jadwal
                                    ?.tanggalBerangkat
                                    ? new Date(
                                        item
                                            .jadwal
                                            ?.tanggalBerangkat,
                                    ).toLocaleString(
                                        'id-ID',
                                    )
                                    : '-'}

                            </div>

                            <div className="mt-5 text-cyan-400">

                                {
                                    item
                                        .detail
                                        ?.length ??
                                    0
                                }{' '}
                                Penumpang

                            </div>

                            <div className="mt-8 flex gap-3">

                                <Link
                                    href={`/pelanggan/tiket/${item.id}`}
                                    className="
                  rounded-xl
                  bg-cyan-400
                  px-6
                  py-3
                  font-bold
                  text-black
                "
                                >
                                    Detail Tiket
                                </Link>

                                {item.status ===
                                    'PENDING' && (
                                        <Link
                                            href={`/pelanggan/pembayaran?id=${item.id}`}
                                            className="
                    rounded-xl
                    border
                    border-cyan-400
                    px-6
                    py-3
                    font-bold
                    text-cyan-400
                  "
                                        >
                                            Bayar
                                        </Link>
                                    )}

                            </div>

                        </div>
                    ),
                )}

            </div>

        </div>
    )
}