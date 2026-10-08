'use client';

export interface MotionPrefs {
  /** user asked for minimal motion — skip/neutralize animations */
  reduced: boolean;
  /** small screen — use gentler distances, skip float/parallax loops */
  mobile: boolean;
}

/** One place for animation gating: accessibility + mobile intensity. */
export function motionPrefs(): MotionPrefs {
  if (typeof window === 'undefined') return { reduced: true, mobile: false };
  return {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    mobile: window.matchMedia('(max-width: 768px)').matches,
  };
}

/** Scale a travel distance down on mobile so motion stays subtle. */
export function calm(v: number, mobile: boolean): number {
  return mobile ? Math.round(v * 0.5) : v;
}
