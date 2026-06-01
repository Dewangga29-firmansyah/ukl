'use client'

import {
  FormEvent,
  ReactNode,
  useState,
} from 'react'

import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Phone,
  Train,
  User,
  CreditCard,
} from 'lucide-react'

import {
  API_URL,
} from '../lib/api'

type RegisterForm = {
  username: string
  password: string
  nik: string
  nama: string
  alamat: string
  telp: string
}

export default function RegisterPage() {
  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false)

  const [
    loading,
    setLoading,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState('')

  const [
    form,
    setForm,
  ] =
    useState<RegisterForm>({
      username: '',
      password: '',
      nik: '',
      nama: '',
      alamat: '',
      telp: '',
    })

  function update(
    key: keyof RegisterForm,
    value: string,
  ) {
    setForm(
      (
        prev,
      ) => ({
        ...prev,
        [key]:
          value,
      }),
    )
  }

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault()

    try {
      setLoading(
        true,
      )

      setError(
        '',
      )

      const res =
        await fetch(
          `${API_URL}/auth/register`,
          {
            method:
              'POST',

            headers:
              {
                'Content-Type':
                  'application/json',
              },

            body:
              JSON.stringify(
                {
                  ...form,

                  role:
                    'PELANGGAN',
                },
              ),
          },
        )

      const data =
        await res.json()

      if (
        !res.ok
      ) {
        throw new Error(
          Array.isArray(
            data.message,
          )
            ? data.message.join(
                '\n',
              )
            : data.message,
        )
      }

      alert(
        'Registrasi berhasil',
      )

      window.location.href =
        '/login'
    } catch (
      err,
    ) {
      setError(
        err instanceof
          Error
          ? err.message
          : 'Registrasi gagal',
      )
    } finally {
      setLoading(
        false,
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-white lg:flex">

      <div className="relative hidden w-1/2 lg:block">

        <Image
          src="/train-bg.jpg"
          alt="train"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex flex-col justify-between p-16">

          <div className="flex items-center gap-3">
            <Train />
            <h1 className="text-3xl font-black">
              RailNusantara
            </h1>
          </div>

          <div>

            <h2 className="text-6xl font-black">
              Daftar
              <br />
              Sekarang
            </h2>

            <p className="mt-5 text-zinc-300">
              Nikmati perjalanan nyaman bersama
              RailNusantara
            </p>

          </div>

        </div>

      </div>

      <div className="flex flex-1 items-center justify-center p-8">

        <div className="w-full max-w-xl">

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-zinc-400"
          >
            <ArrowLeft />
            Kembali
          </Link>

          <form
            onSubmit={
              handleSubmit
            }
            className="rounded-3xl bg-[#111827] p-10"
          >

            <h1 className="text-3xl font-black">
              Registrasi
            </h1>

            <div className="mt-8 grid gap-5">

              <Input
                icon={<User />}
                value={
                  form.username
                }
                placeholder="Username"
                onChange={(
                  v: string,
                ) =>
                  update(
                    'username',
                    v,
                  )
                }
              />

              <Input
                icon={<User />}
                value={
                  form.nama
                }
                placeholder="Nama"
                onChange={(
                  v: string,
                ) =>
                  update(
                    'nama',
                    v,
                  )
                }
              />

              <Input
                icon={<CreditCard />}
                value={
                  form.nik
                }
                placeholder="NIK"
                onChange={(
                  v: string,
                ) =>
                  update(
                    'nik',
                    v,
                  )
                }
              />

              <Input
                icon={<MapPin />}
                value={
                  form.alamat
                }
                placeholder="Alamat"
                onChange={(
                  v: string,
                ) =>
                  update(
                    'alamat',
                    v,
                  )
                }
              />

              <Input
                icon={<Phone />}
                value={
                  form.telp
                }
                placeholder="No Telepon"
                onChange={(
                  v: string,
                ) =>
                  update(
                    'telp',
                    v,
                  )
                }
              />

              <div className="relative">

                <Lock className="absolute left-4 top-4 text-zinc-500" />

                <input
                  required
                  minLength={6}
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={
                    form.password
                  }
                  onChange={(
                    e,
                  ) =>
                    update(
                      'password',
                      e.target
                        .value,
                    )
                  }
                  placeholder="Password"
                  className="h-14 w-full rounded-2xl bg-[#030712] pl-14 pr-14"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (
                        prev,
                      ) =>
                        !prev,
                    )
                  }
                  className="absolute right-4 top-4"
                >
                  {showPassword ? (
                    <EyeOff />
                  ) : (
                    <Eye />
                  )}
                </button>

              </div>

            </div>

            {error && (
              <div className="mt-6 rounded-xl bg-red-500/10 p-4 text-red-300">
                {error}
              </div>
            )}

            <button
              disabled={
                loading
              }
              className="mt-8 h-14 w-full rounded-2xl bg-blue-600 font-bold"
            >
              {loading
                ? 'Memproses...'
                : 'Daftar'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

type InputProps = {
  icon: ReactNode
  value: string
  placeholder: string
  onChange: (
    value: string,
  ) => void
}

function Input({
  icon,
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <div className="relative">

      <div className="absolute left-4 top-4 text-zinc-500">
        {icon}
      </div>

      <input
        required
        value={
          value
        }
        onChange={(
          e,
        ) =>
          onChange(
            e.target
              .value,
          )
        }
        placeholder={
          placeholder
        }
        className="h-14 w-full rounded-2xl bg-[#030712] pl-14 pr-5"
      />

    </div>
  )
}