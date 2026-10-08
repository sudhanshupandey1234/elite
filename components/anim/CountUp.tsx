'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from './gsap-setup';

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Animated number counter that counts up when scrolled into view. */
export function CountUp({ end, suffix = '', duration = 1.6, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${end}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
