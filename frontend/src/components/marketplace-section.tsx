/* eslint-disable @next/next/no-img-element */
import { Activity, ShoppingCart, Filter, ShieldPlus } from "lucide-react";

import { marketplaceGoats } from "@/lib/data";

export function MarketplaceSection() {
  return (
    <section
      id="marketplace"
      className="animate-on-scroll border-gradient relative z-10 mx-auto mt-20 w-full max-w-7xl rounded-3xl border border-slate-200 bg-white/90 px-4 pb-8 pt-6 backdrop-blur before:rounded-3xl sm:p-8 [animation:fadeSlideIn_0.8s_ease-out_0.2s_both]"
    >
      <div className="flex items-center gap-6 px-1">
        <span className="text-3xl font-medium tracking-tight text-slate-900 font-manrope sm:text-4xl">
          Marketplace Kambing
        </span>
        <span aria-hidden className="h-10 w-px bg-slate-200" />
        <span className="font-sans text-sm text-slate-500">
          Jelajahi dan beli kambing dengan transparansi penuh
        </span>
      </div>
      <div className="mt-4 h-px bg-slate-200" />

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="font-sans text-sm text-slate-600 sm:text-base">
            Setiap kambing di Smart Ngangon punya profil lengkap, foto nyata dari
            peternakan, dan opsi pemantauan langsung. Setelah dibeli, kambing akan
            terhubung ke dasbor pribadi Anda untuk perawatan berbasis AI tanpa henti.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-sans inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
            <Filter className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.5} />
            Filter usia, berat, dan ras
          </span>
          <span className="font-sans inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1 text-slate-700">
            <ShieldPlus
              className="h-3.5 w-3.5 text-lime-500"
              strokeWidth={1.5}
            />
            Sudah diperiksa dan divaksin
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {marketplaceGoats.map((goat) => (
          <article
            key={goat.id}
            className="border-gradient hover-lift flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white before:rounded-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={goat.image}
                alt={`Kambing ${goat.id}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                {goat.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`font-sans inline-flex items-center gap-1.5 rounded-full px-2 py-1 ${badge.className}`}
                  >
                    {badge.dotClassName ? (
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClassName}`} />
                    ) : null}
                    {badge.label}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="font-sans inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-50 backdrop-blur-sm">
                  <Activity className="h-3 w-3 text-lime-300" strokeWidth={1.5} />
                  {goat.healthScore}
                </div>
                <div className="font-sans rounded-full border border-white/10 bg-slate-900/80 px-2 py-1 text-[11px] text-white">
                  {goat.tagLabel}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-sans text-sm font-medium tracking-tight text-slate-900">
                    Kambing #{goat.id} {goat.nickname}
                  </p>
                  <p className="font-sans mt-0.5 text-xs text-slate-500">
                    {goat.info}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm font-medium tracking-tight text-slate-900">
                    {goat.price}
                  </p>
                  <p className="font-sans text-[11px] text-slate-500">
                    {goat.purchaseNote}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                {goat.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5"
                  >
                    <span className="font-sans text-[10px] text-slate-500">
                      {stat.label}
                    </span>
                    <span
                      className={`font-sans font-medium text-slate-900 ${stat.valueClassName ?? ""}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <button className="font-sans mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2.5 text-xs font-medium text-white transition hover:border-slate-900 hover:bg-slate-800">
                Tambah ke keranjang &amp; pantau
                <ShoppingCart
                  className="h-3.5 w-3.5 text-lime-300"
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
