/* eslint-disable @next/next/no-img-element */
import { BackgroundGlow } from "@/components/background-glow";
import {
  Activity,
  BellRing,
  BrainCircuit,
  MapPin,
  PlayCircle,
  Radar,
  RadioTower,
  Rss,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Video,
  LockKeyhole,
} from "lucide-react";
import { GlowButton } from "@/components/glow-button";

const heroAvatars = [
  {
    src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=320&q=80",
    alt: "Peternak Smart Ngangon 1",
  },
  {
    src: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
    alt: "Peternak Smart Ngangon 2",
  },
  {
    src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=320&q=80",
    alt: "Peternak Smart Ngangon 3",
  },
];

const quickIndicators = [
  {
    label: "Kambing terpantau",
    value: "24 / 24",
    icon: Radar,
    valueClassName: "text-slate-900",
  },
  {
    label: "Peringatan kesehatan",
    value: "0 masalah",
    icon: Activity,
    valueClassName: "text-emerald-600",
  },
  {
    label: "Cakupan RFID",
    value: "100%",
    icon: MapPin,
    valueClassName: "text-slate-900",
    iconClassName: "text-sky-500",
  },
];

const highlightCards = [
  {
    title: "Pemeriksaan kesehatan berbasis AI",
    description:
      "Kamera mendeteksi tanda sakit, gerak menurun, atau perilaku tidak biasa dan langsung memberi tahu Anda.",
    icon: Sparkles,
    iconClasses: "bg-lime-50 ring-1 ring-lime-100",
    wrapperClassName: "bg-white/80",
  },
  {
    title: "Pelacakan RFID & IoT",
    description:
      "Setiap kambing memakai tag RFID sehingga Anda selalu tahu posisinya di peternakan tanpa perlu menghitung manual.",
    icon: RadioTower,
    iconClasses: "bg-sky-50 ring-1 ring-sky-100",
    wrapperClassName: "bg-white/80",
  },
  {
    title: "Dasbor tenang terpadu",
    description:
      "Setelah membeli, Anda mendapat dasbor pribadi untuk menonton video langsung, memantau kesehatan, dan melacak lokasi kambing secara real time.",
    icon: Smartphone,
    iconClasses: "bg-white ring-1 ring-lime-200",
    wrapperClassName: "bg-lime-50/80",
  },
];

export function HeroSection() {
  return (
    <section className="relative z-10 pt-24 pb-8">
      <BackgroundGlow
        className="absolute inset-0 -z-10"
        overlayClassName="bg-gradient-to-b from-white/30 via-transparent to-white/40"
      />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 md:px-6 md:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-sans animate-fadeSlideIn mb-4 inline-flex items-center gap-2 rounded-full border border-lime-100 bg-lime-50 px-3 py-1 text-xs font-medium text-lime-700">
            <ShieldCheck className="h-4 w-4 text-lime-600" strokeWidth={1.5} />
            Ketenteraman untuk pemilik kambing modern
          </p>

          <h1 className="font-manrope animate-fadeSlideIn-delay-200 text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Beli kambing dengan percaya diri,
            <br className="hidden sm:block" />
            pantau dari mana saja.
          </h1>

          <p className="font-sans animate-fadeSlideIn-delay-400 mx-auto mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
            Smart Ngangon menggabungkan kamera bertenaga AI dan sensor IoT sehingga Anda bisa
            membeli kambing secara online dan mengawasi kesehatan, pergerakan, serta kenyamanan mereka
            24/7 langsung dari ponsel Anda.
          </p>

          <div className="animate-fadeSlideIn-delay-600 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GlowButton label="Jelajahi kambing siap jual" />

            <button className="group relative inline-flex min-w-[140px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-[17px] py-[12px] text-slate-700 font-medium tracking-tight transition-all duration-500 hover:-translate-y-[3px] hover:border-lime-300 hover:text-slate-900">
              <span className="relative z-10 flex items-center gap-2 font-sans">
                <PlayCircle
                  className="h-4 w-4 text-lime-500"
                  strokeWidth={1.5}
                />
                Tonton cara kerjanya
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-[1px] w-[70%] -translate-x-1/2 opacity-40 transition-all duration-700 group-hover:opacity-80"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(148,163,184,0) 0%,rgba(148,163,184,1) 50%,rgba(148,163,184,0) 100%)",
                }}
              />
            </button>
          </div>

          <div className="animate-fadeSlideIn-delay-600 mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-500 sm:flex-row">
            <div className="flex -space-x-2">
              {heroAvatars.map((avatar) => (
                <img
                  key={avatar.src}
                  src={avatar.src}
                  alt={avatar.alt}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                />
              ))}
            </div>
            <span className="font-sans">
              Dipercaya peternak, investor, dan pemilik ternak cerdas di seluruh
              wilayah
            </span>
          </div>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[3fr,2.2fr]">
          <div className="border-gradient relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] before:rounded-3xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-lime-50 text-lime-700 ring-1 ring-lime-100">
                  <Video className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-sans text-xs font-medium tracking-tight text-slate-900">
                    Kamera kandang langsung
                  </p>
                  <p className="font-sans text-[11px] text-slate-500">
                    Analitik kesehatan &amp; perilaku berbasis AI
                  </p>
                </div>
              </div>
              <span className="font-sans inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Semua kambing sehat
              </span>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1580975182994-ac99330b89e8?w=1600&q=80"
                alt="Kambing di kandang pintar"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/0 to-slate-900/10" />

              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <div className="font-sans inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-50 backdrop-blur-sm">
                  <BrainCircuit
                    className="h-3 w-3 text-lime-300"
                    strokeWidth={1.5}
                  />
                  Pemindaian kesehatan AI
                </div>
                <div className="font-sans inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-50 backdrop-blur-sm">
                  <Rss className="h-3 w-3 text-lime-300" strokeWidth={1.5} />
                  Sensor IoT aktif
                </div>
              </div>

              <div className="absolute left-[14%] top-[38%] h-[30%] w-[18%] rounded-md border border-lime-300/80 bg-lime-200/10 backdrop-blur-[1px]">
                <div className="font-sans absolute -top-5 left-0 rounded-full bg-lime-500 px-1.5 py-0.5 text-[10px] font-medium text-slate-900 shadow-sm">
                  Sehat
                </div>
              </div>
              <div className="absolute bottom-[15%] right-[12%] h-[32%] w-[20%] rounded-md border border-amber-400/90 bg-amber-200/10 backdrop-blur-[1px]">
                <div className="absolute -top-5 left-0 flex items-center gap-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-medium text-slate-900 shadow-sm">
                  <span className="font-sans">Periksa pola makan</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 via-slate-900/0 to-transparent px-3 pb-2 pt-4">
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-100">
                  <span className="font-sans">Kandang 1 - Kamera Timur</span>
                  <span className="font-sans inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    Langsung
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/20">
                  <div className="h-full w-2/3 rounded-full bg-lime-400" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] sm:text-xs">
              {quickIndicators.map((indicator) => (
                <div
                  key={indicator.label}
                  className="hover-lift flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <p className="font-sans mb-0.5 text-slate-500">
                      {indicator.label}
                    </p>
                    <p
                      className={`font-sans text-sm font-medium tracking-tight ${indicator.valueClassName}`}
                    >
                      {indicator.value}
                    </p>
                  </div>
                  <indicator.icon
                    className={`mt-1 h-4 w-4 text-lime-500 ${
                      indicator.iconClassName ?? ""
                    }`}
                    strokeWidth={1.5}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {highlightCards.map((card) => (
              <div
                key={card.title}
                className={`border-gradient hover-lift rounded-3xl border border-slate-200 p-4 sm:p-5 ${card.wrapperClassName} before:rounded-3xl`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${card.iconClasses}`}
                  >
                    <card.icon
                      className="h-4 w-4 text-lime-500"
                      strokeWidth={1.5}
                    />
                  </span>
                  <div>
                    <p className="font-sans text-sm font-medium tracking-tight text-slate-900">
                      {card.title}
                    </p>
                    <p className="font-sans mt-0.5 text-xs text-slate-600">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="font-sans inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-sm">
                <LockKeyhole
                  className="h-3.5 w-3.5 text-slate-500"
                  strokeWidth={1.5}
                />
                Data aman &amp; streaming HD
              </div>
              <div className="font-sans inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-sm">
                <BellRing
                  className="h-3.5 w-3.5 text-lime-500"
                  strokeWidth={1.5}
                />
                Notifikasi instan
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
