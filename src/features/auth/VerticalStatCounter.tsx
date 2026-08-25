"use client";

import { useEffect, useRef, useState } from "react";

type VerticalStatCounterProps = {
  to: number;
  suffix?: string;
  className?: string;
};

/** ThemeZaa `.vertical-counter` without jQuery — animates when scrolled into view. */
export function VerticalStatCounter({
  to,
  suffix = "%",
  className = "",
}: VerticalStatCounterProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, to]);

  return (
    <h3
      ref={ref}
      className={`vertical-counter d-inline-flex alt-font text-green fw-700 ls-minus-3px m-0 pgs-stat-counter ${className}`}
      data-text={suffix}
      data-to={to}
      aria-label={`${to}${suffix}`}
    >
      <span className="pgs-stat-counter-value">{value}</span>
    </h3>
  );
}
