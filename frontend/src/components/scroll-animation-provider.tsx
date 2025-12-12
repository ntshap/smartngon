"use client";

import { useEffect, type ReactNode } from "react";

type ScrollAnimationProviderProps = {
  children: ReactNode;
};

export function ScrollAnimationProvider({
  children,
}: ScrollAnimationProviderProps) {
  useEffect(() => {
    const selector = ".animate-on-scroll";
    const elements = document.querySelectorAll(selector);
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

