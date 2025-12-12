import {
  AlertCircle,
  AlertOctagon,
  BellRing,
  FileText,
  HeartPulse,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlowButton } from "@/components/glow-button";

type DashboardGoat = {
  name: string;
  detail: string;
  highlight?: boolean;
  badge?: {
    text: string;
    className: string;
    badgeDot?: string;
    icon?: LucideIcon;
  };
};

const dashboardGoats: DashboardGoat[] = [
  {
    name: "Luna",
    detail: "Kesehatan 99% - Kandang 1",
    badge: {
      text: "OK",
      className: "text-emerald-600 bg-emerald-50",
      badgeDot: "bg-emerald-500",
    },
    highlight: true,
  },
  {
    name: "Aruna",
    detail: "Kesehatan 96% - Kandang 2",
    badge: {
      text: "Cek",
      className: "text-amber-600 bg-amber-50",
      icon: AlertCircle,
    },
  },
  {
    name: "Rama",
    detail: "Kesehatan 94% - Padang rumput",
    badge: { text: "Riwayat", className: "text-slate-600 bg-slate-50" },
  },
];

type MonitoringBullet = {
  iconBg: string;
  iconColor: string;
  icon: LucideIcon;
  text: string;
};

const monitoringBullets: MonitoringBullet[] = [
  {
    iconBg: "bg-lime-100 border-lime-300",
    iconColor: "text-lime-600",
    icon: Video,
    text: "Tonton video langsung tiap kandang dan zona tempat kambing Anda berada.",
  },
  {
    iconBg: "bg-sky-100 border-sky-300",
    iconColor: "text-sky-700",
    icon: AlertOctagon,
    text: "Terima peringatan saat AI mendeteksi perilaku abnormal atau potensi penyakit.",
  },
  {
    iconBg: "bg-emerald-100 border-emerald-300",
    iconColor: "text-emerald-700",
    icon: MapPin,
    text: "Pantau data pembaca RFID dan ketahui kapan kambing berpindah zona.",
  },
  {
    iconBg: "bg-slate-100 border-slate-300",
    iconColor: "text-slate-700",
    icon: FileText,
    text: "Simak catatan kesehatan, pakan, dan pergerakan setiap kambing.",
  },
];

export function MonitoringSection() {
  return (
    <section
      id="monitoring"
      className="animate-on-scroll border-gradient relative mx-auto mt-20 w-full max-w-7xl rounded-3xl border border-slate-200 bg-slate-50/80 px-4 pb-6 pt-6 backdrop-blur before:rounded-3xl sm:p-8 [animation:fadeSlideIn_0.8s_ease-out_0.25s_both]"
    >
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className="font-manrope text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Lihat, pahami, dan bertindak seketika
          </h3>
          <p className="font-sans mt-3 text-sm text-slate-600 sm:text-base">
            Begitu transaksi selesai, kambing Anda muncul di dasbor Smart
            Ngangon. Dari sana Anda dapat:
          </p>

          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {monitoringBullets.map((bullet) => (
              <li key={bullet.text} className="flex items-start gap-2">
                <span
                  className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${bullet.iconBg}`}
                >
                  <bullet.icon
                    className={`h-3 w-3 ${bullet.iconColor}`}
                    strokeWidth={1.5}
                  />
                </span>
                <span className="font-sans">{bullet.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 h-px bg-slate-200" />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <GlowButton label="Coba dasbor demo" />
            <div className="font-sans flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck
                className="h-3.5 w-3.5 text-lime-500"
                strokeWidth={1.5}
              />
              Streaming terenkripsi &amp; akses aman
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span className="font-sans ml-2 text-slate-500">
                  dashboard.smartngangon.com
                </span>
              </div>
              <div className="font-sans inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Terhubung
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 sm:p-5">
              <div className="col-span-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:col-span-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-medium text-slate-800">
                    Kambing Anda
                  </span>
                  <span className="font-sans text-[11px] text-slate-500">
                    3 aktif
                  </span>
                </div>
                <div className="space-y-2 text-[11px]">
                  {dashboardGoats.map((goat) => (
                    <button
                      key={goat.name}
                      className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left ${
                        goat.highlight
                          ? "border-lime-200 bg-white"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div>
                        <p className="font-sans font-medium text-slate-900">
                          {goat.name}
                        </p>
                        <p className="font-sans text-[10px] text-slate-500">
                          {goat.detail}
                        </p>
                      </div>
                      <span
                        className={`font-sans inline-flex items-center gap-1 rounded-full border border-current px-2 py-0.5 ${
                          goat.badge?.className ?? ""
                        }`}
                      >
                        {goat.badge?.icon ? (
                          <goat.badge.icon
                            className="h-3 w-3"
                            strokeWidth={1.5}
                          />
                        ) : null}
                        {goat.badge?.badgeDot ? (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${goat.badge.badgeDot}`}
                          />
                        ) : null}
                        {goat.badge?.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-8 flex flex-col gap-4 md:col-span-9">
                <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                    <div>
                      <p className="font-sans mb-0.5 text-slate-500">
                        Kesehatan keseluruhan
                      </p>
                      <p className="font-sans text-sm font-medium tracking-tight text-slate-900">
                        97%
                      </p>
                    </div>
                    <HeartPulse
                      className="h-4 w-4 text-emerald-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                    <div>
                      <p className="font-sans mb-0.5 text-slate-500">
                        Peringatan hari ini
                    </p>
                    <p className="font-sans text-sm font-medium tracking-tight text-slate-900">
                        1 prioritas rendah
                      </p>
                    </div>
                    <BellRing
                      className="h-4 w-4 text-amber-500"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans text-slate-700">
                        Tren kesehatan (7 hari)
                      </span>
                      <span className="font-sans inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600">
                        <TrendingUp className="h-3 w-3" strokeWidth={1.5} />
                        Membaik
                      </span>
                    </div>
                    <div className="mt-1 flex h-20 items-end justify-between rounded-lg border border-dashed border-slate-200 bg-slate-50 px-2">
                      {[6, 8, 9, 11, 12, 14, 16].map((height, index) => (
                        <div
                          key={index}
                          className={`w-4 rounded-t ${
                            height >= 14
                              ? "bg-emerald-500"
                              : height >= 11
                                ? "bg-emerald-400"
                                : height >= 9
                                  ? "bg-emerald-300"
                                  : "bg-emerald-200"
                          }`}
                          style={{ height: `${height * 2}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans text-slate-700">
                        Lokasi terkini
                      </span>
                      <span className="font-sans text-[11px] text-slate-500">
                        Diperbarui 2 menit lalu
                      </span>
                    </div>
                    <div className="mt-1 grid grid-cols-3 gap-2 text-[11px]">
                      <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <span className="font-sans text-[10px] text-slate-500">
                          Kandang 1
                        </span>
                        <span className="font-sans font-medium text-slate-900">
                          2 kambing
                        </span>
                      </div>
                      <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <span className="font-sans text-[10px] text-slate-500">
                          Kandang 2
                        </span>
                        <span className="font-sans font-medium text-slate-900">
                          1 kambing
                        </span>
                      </div>
                      <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <span className="font-sans text-[10px] text-slate-500">
                          Luar kandang
                        </span>
                        <span className="font-sans font-medium text-emerald-600">
                          0 kambing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
