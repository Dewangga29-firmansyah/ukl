'use client'

import {
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'

import {
  Check,
  Download,
  X,
} from 'lucide-react'

import AdminShell from '../components/AdminShell'

import {
  API_URL,
  ApiError,
  ApiPembelian,
  clearAuthSession,
  formatRupiah,
  getAuthToken,
  getPembelian,
} from '../../lib/api'

function code(
  item: ApiPembelian
) {
  return (
    item.kodePembelian ||
    item.kode ||
    item.id
  )
}

function passenger(
  item: ApiPembelian
) {
  return (
    item.pelanggan
      ?.nama ||
    item.pelanggan
      ?.user
      ?.username ||
    '-'
  )
}

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [data, setData] =
    useState<
      ApiPembelian[]
    >([])

  const [error, setError] =
    useState('')

  async function load() {
    try {
      setLoading(
        true
      )

      const token =
        getAuthToken()

      if (!token) {
        throw new Error(
          'Login ulang'
        )
      }

      const result =
        await getPembelian(
          token
        )

      setData(
        result
      )

      setError('')

    } catch (
      err
    ) {
      if ((err instanceof ApiError && err.status === 401) || (err && typeof err === 'object' && 'status' in err && (err as any).status === 401)) {
        clearAuthSession()
        router.push('/login')
        return
      }
      setError(
        err instanceof
          Error
          ? err.message
          : 'Gagal'
      )
    } finally {
      setLoading(
        false
      )
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function action(
    id: string,
    type:
      | 'confirm'
      | 'cancel'
  ) {
    try {
      setSaving(
        true
      )

      const res =
        await fetch(
          `${API_URL}/pembelian/${id}/${type}`,
          {
            method:
              'PATCH',

            headers:
              {
                Authorization:
                  `Bearer ${getAuthToken()}`,
              },
          }
        )

      const json =
        await res.json()

      if (
        !res.ok
      ) {
        throw new Error(
          json.message
        )
      }

      await load()

    } catch (
      err
    ) {
      alert(
        err instanceof
          Error
          ? err.message
          : 'Error'
      )
    } finally {
      setSaving(
        false
      )
    }
  }

  async function tiket(
    id: string
  ) {
    window.open(
      `${API_URL}/pembelian/${id}/tiket`,
      '_blank'
    )
  }

  return (
    <AdminShell title="Pembelian">

      <h1 className="text-[38px] font-extrabold text-white">
        Pembelian
      </h1>

      <p className="mt-2 text-[#8fb5df]">
        Kelola transaksi tiket
      </p>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-500/10 p-5 text-red-100">
          {error}
        </div>
      )}

      <div className="mt-10 overflow-hidden rounded-3xl bg-[#121b2d]">

        <table className="w-full">

          <thead>

            <tr className="border-b border-[#233554] text-left text-[#8fb5df]">

              <th className="p-5">
                Kode
              </th>

              <th>
                Penumpang
              </th>

              <th>
                Total
              </th>

              <th>
                Status
              </th>

              <th>
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-10 text-[#8fb5df]"
                >
                  Memuat...
                </td>

              </tr>

            ) : data.length ===
              0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-10 text-[#8fb5df]"
                >
                  Belum ada transaksi
                </td>

              </tr>

            ) : (

              data.map(
                (
                  item
                ) => (

                  <tr
                    key={
                      item.id
                    }
                    className="border-b border-[#1d2b44]"
                  >

                    <td className="p-5 text-white">

                      {
                        code(
                          item
                        )
                      }

                    </td>

                    <td className="text-[#c9d7ee]">

                      {
                        passenger(
                          item
                        )
                      }

                    </td>

                    <td className="text-cyan-300">

                      {
                        formatRupiah(
                          item.total ??
                          item.totalBayar
                        )
                      }

                    </td>

                    <td>

                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">

                        {
                          item.status ||
                          '-'
                        }

                      </span>

                    </td>

                    <td>

                      <div className="flex gap-3">

                        <button
                          disabled={
                            saving
                          }
                          onClick={() =>
                            action(
                              item.id,
                              'confirm'
                            )
                          }
                          className="rounded-xl bg-green-500 p-2"
                        >

                          <Check />

                        </button>

                        <button
                          disabled={
                            saving
                          }
                          onClick={() =>
                            action(
                              item.id,
                              'cancel'
                            )
                          }
                          className="rounded-xl bg-red-500 p-2"
                        >

                          <X />

                        </button>

                        <button
                          onClick={() =>
                            tiket(
                              item.id
                            )
                          }
                          className="rounded-xl bg-cyan-500 p-2"
                        >

                          <Download />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </AdminShell>
  )
}
