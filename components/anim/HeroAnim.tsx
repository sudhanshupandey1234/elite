'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from './gsap-setup';

/**
 * Hero entrance choreography: eyebrow -> title -> description -> CTAs ->
 * stats -> showcase card, then a gentle infinite float on the showcase
 * and a subtle parallax on the background wash. All driven by GSAP.
 * Skipped entirely when the user prefers reduced motion.
 */
export function HeroAnim({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hero="eyebrow"]', { y: 22, autoAlpha: 0, duration: 0.7 })
        .from('[data-hero="title"]', { y: 42, autoAlpha: 0, duration: 0.9 }, '-=0.5')
        .from('[data-hero="desc"]', { y: 26, autoAlpha: 0, duration: 0.8 }, '-=0.65')
        .from('[data-hero="cta"] > *', { y: 18, autoAlpha: 0, duration: 0.55, stagger: 0.09 }, '-=0.6')
        .from('[data-hero="stats"] > *', { y: 16, autoAlpha: 0, duration: 0.55, stagger: 0.1 }, '-=0.45')
        .from('[data-hero="showcase"]', { y: 46, autoAlpha: 0, scale: 0.96, duration: 1.05 }, '-=0.9')
        .from('[data-hero="showcase-row"]', { y: 18, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, '-=0.6');

      // Gentle floating loop on the showcase card
      gsap.to('[data-hero="showcase"]', {
        y: -10,
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.8,
      });

      // Subtle parallax on the background wash while scrolling away
      gsap.to('[data-hero="bg"]', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
