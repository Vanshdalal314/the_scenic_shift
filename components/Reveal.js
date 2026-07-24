"use client";

import { useInView } from "@/lib/useInView";

export function useReveal(delay = 0) {
  const [ref, inView] = useInView();
  return {
    ref,
    style: { transitionDelay: inView ? `${delay}ms` : "0ms" },
    className: `transition-all duration-700 ease-out ${
      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`,
  };
}
