import { Check, Info, Star, MessagesSquare, ArrowRight } from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="sm:p-8 bg-white/90 w-full max-w-7xl border border-slate-200 rounded-3xl mt-20 mx-auto pt-6 pr-6 pb-10 pl-6 relative backdrop-blur border-gradient before:rounded-3xl animate-on-scroll"
    >
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight font-manrope">
            Harga Simpel, Dibuat untuk Pemilik
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-[52ch]">
            Beli kambing sekali, lalu pilih paket monitoring terjangkau. Anda
            bisa upgrade atau batalkan kapan saja.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-600">
          <Info className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
          Hardware, staf kandang, dan pemrosesan AI sudah termasuk.
        </div>
      </div>

      <div className="h-px bg-slate-200 mt-6 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan 1 */}
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-5 flex flex-col hover-lift">
          <p className="text-xs font-medium text-lime-700 inline-flex items-center gap-1">
            Monitoring Starter
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-slate-900">
              Rp 135rb
            </span>
            <span className="text-xs text-slate-500">/ kambing / bulan</span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Cocok untuk pemilik pemula yang ingin memantau kesehatan dan lokasi
            harian.
          </p>

          <ul className="mt-4 space-y-2 text-xs text-slate-700">
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-500 mt-0.5"
                strokeWidth={1.5}
              />
              Video HD Langsung (kandang bersama)
            </li>
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-500 mt-0.5"
                strokeWidth={1.5}
              />
              Ringkasan kesehatan AI harian
            </li>
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-500 mt-0.5"
                strokeWidth={1.5}
              />
              Pelacakan lokasi RFID dasar
            </li>
          </ul>

          <button className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium py-2.5 px-3 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition">
            Pilih Starter
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Plan 2 (featured) */}
        <div className="relative rounded-2xl border border-lime-300 bg-lime-50 p-5 flex flex-col hover-lift shadow-[0_18px_45px_rgba(132,204,22,0.25)]">
          <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-slate-900 text-[10px] text-white px-2.5 py-1 border border-slate-700">
            <Star className="w-3 h-3 text-amber-300" strokeWidth={1.5} />
            Paling Populer
          </span>

          <p className="text-xs font-medium text-lime-800 inline-flex items-center gap-1">
            Monitoring Pro
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-slate-900">
              Rp 225rb
            </span>
            <span className="text-xs text-slate-600">/ kambing / bulan</span>
          </div>
          <p className="mt-2 text-xs text-slate-700">
            Ideal untuk investor dan peternak yang butuh data lebih dalam dan
            notifikasi cepat.
          </p>

          <ul className="mt-4 space-y-2 text-slate-800 text-xs">
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-600 mt-0.5"
                strokeWidth={1.5}
              />
              Semua fitur Starter
            </li>
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-600 mt-0.5"
                strokeWidth={1.5}
              />
              Analisis perilaku & overlay per kambing
            </li>
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-600 mt-0.5"
                strokeWidth={1.5}
              />
              Notifikasi instan
            </li>
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-600 mt-0.5"
                strokeWidth={1.5}
              />
              Riwayat kesehatan 12 bulan
            </li>
          </ul>

          <button className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-900 bg-slate-900 text-white text-xs font-medium py-2.5 px-3 hover:bg-slate-800 hover:border-slate-800 transition">
            Pilih Pro
            <ArrowRight
              className="w-3.5 h-3.5 text-lime-300"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Plan 3 */}
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-5 flex flex-col hover-lift">
          <p className="text-xs font-medium text-slate-800 inline-flex items-center gap-1">
            Peternakan & Perusahaan
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-slate-900">
              Khusus
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Didesain untuk peternakan dengan puluhan atau ratusan kambing.
          </p>

          <ul className="mt-4 space-y-2 text-xs text-slate-700">
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-500 mt-0.5"
                strokeWidth={1.5}
              />
              Harga volume untuk 20+ kambing
            </li>
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-500 mt-0.5"
                strokeWidth={1.5}
              />
              Akses API & ekspor data
            </li>
            <li className="flex gap-2">
              <Check
                className="w-3.5 h-3.5 text-lime-500 mt-0.5"
                strokeWidth={1.5}
              />
              Manajer sukses khusus
            </li>
          </ul>

          <button className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium py-2.5 px-3 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition">
            Hubungi Penjualan
            <MessagesSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <p className="mt-5 text-[11px] text-slate-500">
        Paket monitoring bersifat opsional. Anda sepenuhnya memiliki kambing
        yang Anda beli melalui Smart Ngangon.
      </p>
    </section>
  );
}
