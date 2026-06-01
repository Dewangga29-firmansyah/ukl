"use client";

import { useEffect, useRef } from "react";
import { ScanLine } from "lucide-react";
import AdminShell from "../components/AdminShell";

export default function AdminPaymentPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Gagal membuka kamera:", error);
        alert("Kamera tidak dapat diakses.");
      }
    }

    startCamera();

    return () => {
      const video = videoRef.current;
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <AdminShell title="Scan Tiket">
      <h1 className="text-[38px] font-extrabold leading-tight text-white">
        Scan Tiket
      </h1>

      <p className="mt-3 text-[21px] text-[#8fb5df]">
        Validasi tiket penumpang sebelum keberangkatan.
      </p>

      <div className="mt-10 rounded-[18px] border border-[#2f4568] bg-[#121b2d] p-6">
        <div className="mb-4 flex items-center gap-3">
          <ScanLine className="h-6 w-6 text-[#06d5f2]" />
          <h2 className="text-xl font-bold text-white">
            Kamera Scanner
          </h2>
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-xl border border-[#24344f]"
        />
      </div>
    </AdminShell>
  );
}