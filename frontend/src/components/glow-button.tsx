import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowButtonProps = {
  label: string;
  icon?: ReactNode;
  className?: string;
};

const points = Array.from({ length: 10 });

export function GlowButton({
  label,
  icon = <ArrowRight className="icon" />,
  className,
}: GlowButtonProps) {
  return (
    <button type="button" className={cn("button", className)}>
      <div className="points_wrapper">
        {points.map((_, index) => (
          <span key={index} className="point" />
        ))}
      </div>
      <span className="inner">
        {label}
        {icon}
      </span>
    </button>
  );
}

