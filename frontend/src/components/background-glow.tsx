import { cn } from "@/lib/utils";

type BackgroundGlowProps = {
  className?: string;
  videoSrc?: string;
  overlayClassName?: string;
};

export function BackgroundGlow({
  className,
  videoSrc = "/green%20background.mp4",
  overlayClassName,
}: BackgroundGlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none overflow-hidden",
        className ?? "fixed inset-0",
      )}
    >
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {overlayClassName ? (
        <div
          className={cn("absolute inset-0", overlayClassName)}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
