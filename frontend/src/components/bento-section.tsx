import { BellRing, Rss, ScanFace, Smartphone } from "lucide-react";
import { GlowButton } from "@/components/glow-button";

const timelineSteps = [
  {
    title: "1. Pilih kambing Anda",
    description:
      "Jelajahi profil lengkap di marketplace: usia, bobot, ras, riwayat vaksin, serta foto terbaru.",
    titleClassName: "text-lime-700",
    dotBorderClass: "border-lime-400",
    dotClassName: "bg-lime-400",
  },
  {
    title: "2. Kami pasang tag & sambungkan",
    description:
      "Setelah pembelian, setiap kambing dipasangi tag RFID dan ditempatkan pada zona kamera berbasis AI di peternakan.",
    titleClassName: "text-sky-700",
    dotBorderClass: "border-sky-400",
    dotClassName: "bg-sky-400",
  },
  {
    title: "3. Pantau lewat dasbor Anda",
    description:
      "Akses dasbor pribadi untuk menonton video langsung, menerima notifikasi kesehatan AI, serta mengecek lokasi dan aktivitas kapan saja.",
    titleClassName: "text-emerald-700",
    dotBorderClass: "border-emerald-400",
    dotClassName: "bg-emerald-400",
  },
];

const visualCards = [
  {
    image:
      "/images/features/ai_health_detection.png",
    label: {
      icon: ScanFace,
      text: "Zona kamera AI",
      iconClass: "text-lime-500",
    },
    topRight: {
      text: "Skor kesehatan:",
      accent: "98%",
      accentClass: "text-lime-600",
    },
    description: "AI mendeteksi tanda sakit sejak dini sebelum menjadi serius.",
  },
  {
    image:
      "/images/features/iot_tracking_sensors.png",
    label: {
      icon: Rss,
      text: "Gerbang RFID",
      iconClass: "text-sky-500",
    },
    topRight: {
      text: "Pergerakan terakhir:",
      accent: "2 menit lalu",
      accentClass: "text-emerald-600",
    },
    description:
      "Sensor IoT mencatat perpindahan setiap kambing di peternakan secara otomatis.",
  },
  {
    image:
      "/images/features/remote_monitoring_mobile.png",
    label: {
      icon: Smartphone,
      text: "Dasbor pemilik",
      iconClass: "text-lime-500",
    },
    description: "Pantau kambing Anda secara langsung dari mana pun di dunia.",
    tall: true,
  },
  {
    image:
      "/images/features/weekly_health_reports.png",
    label: {
      icon: BellRing,
      text: "Peringatan & laporan",
      iconClass: "text-amber-500",
    },
    description:
      "Ringkasan kesehatan mingguan dan notifikasi instan membuat Anda selalu siap.",
    tall: true,
  },
];

export function BentoSection() {
  return (
    <section
      id="how-it-works"
      className="animate-on-scroll border-gradient relative mx-auto mt-16 max-w-7xl rounded-3xl border border-slate-200 bg-white/80 px-4 pb-6 pt-6 backdrop-blur before:rounded-3xl sm:p-8 [animation:fadeSlideIn_0.8s_ease-out_0.1s_both]"
    >
      <div className="relative grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-6 px-1">
              <span className="text-3xl font-medium tracking-tight text-slate-900 font-manrope sm:text-4xl">
                Cara kerja Smart Ngangon
              </span>
            </div>
            <div className="mt-4 h-px bg-slate-200" />

            <div className="mt-8 hidden flex-col gap-4 text-slate-700 sm:flex">
              {timelineSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  {index < timelineSteps.length - 1 && (
                    <div className="absolute left-2 top-8 bottom-0 w-px bg-gradient-to-b from-lime-400 via-sky-400 to-emerald-400" />
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={`relative mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 bg-white ${step.dotBorderClass}`}
                    >
                      <div
                        className={`absolute left-0.5 top-0.5 h-1.5 w-1.5 rounded-full ${step.dotClassName}`}
                      />
                    </div>
                    <div className="flex-1 pb-6">
                      <span
                        className={`font-sans text-sm font-medium ${step.titleClassName}`}
                      >
                        {step.title}
                      </span>
                      <p className="font-sans mt-1 text-xs text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="font-sans text-sm font-medium tracking-tight text-slate-900">
            Pemantauan teknologi tinggi yang mudah digunakan
          </p>
          <p className="font-sans mt-1 max-w-md text-sm text-slate-600">
            Smart Ngangon memadukan AI modern, sensor IoT, dan manajemen ternak
            yang ramah hewan sehingga Anda bisa berinvestasi tanpa tinggal di
            peternakan. Rasakan tenangnya selalu tahu hewan Anda aman.
          </p>
          <GlowButton label="Lihat marketplace" className="mt-4 max-w-[220px]" />
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-4 lg:col-span-2">
        {visualCards.map((card) => (
          <article
            key={card.label.text + card.description}
            className={`border-gradient relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 bg-cover bg-center before:rounded-2xl ${card.tall ? "aspect-[4/5]" : "aspect-[4/3]"
              }`}
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-slate-900/60" />
            <div className="absolute left-3 top-3">
              <span className="font-sans inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 backdrop-blur">
                <card.label.icon
                  className={`h-3.5 w-3.5 ${card.label.iconClass}`}
                  strokeWidth={1.5}
                />
                {card.label.text}
              </span>
            </div>
            {card.topRight ? (
              <div className="absolute right-3 top-3">
                <span className="font-sans inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs text-slate-700 backdrop-blur">
                  {card.topRight.text}{" "}
                  <span
                    className={`font-sans font-medium ${card.topRight.accentClass}`}
                  >
                    {card.topRight.accent}
                  </span>
                </span>
              </div>
            ) : null}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="font-sans text-lg font-medium leading-tight tracking-tight text-white">
                {card.description}
              </p>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
