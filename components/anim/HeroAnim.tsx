'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from './gsap-setup';
import { motionPrefs, calm } from './motion';

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
    const { reduced, mobile } = motionPrefs();
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hero="eyebrow"]', { y: calm(22, mobile), autoAlpha: 0, duration: 0.7 })
        .from('[data-hero="title"]', { y: calm(42, mobile), autoAlpha: 0, duration: 0.9 }, '-=0.5')
        .from('[data-hero="desc"]', { y: calm(26, mobile), autoAlpha: 0, duration: 0.8 }, '-=0.65')
        .from('[data-hero="cta"] > *', { y: calm(18, mobile), autoAlpha: 0, duration: 0.55, stagger: 0.09 }, '-=0.6')
        .from('[data-hero="stats"] > *', { y: calm(16, mobile), autoAlpha: 0, duration: 0.55, stagger: 0.1 }, '-=0.45')
        .from('[data-hero="showcase"]', { y: calm(46, mobile), autoAlpha: 0, scale: 0.96, duration: 1.05 }, '-=0.9')
        .from('[data-hero="showcase-row"]', { y: calm(18, mobile), autoAlpha: 0, duration: 0.5, stagger: 0.08 }, '-=0.6');

      if (!mobile) {
        // Gentle floating loop on the showcase card (desktop only)
        gsap.to('[data-hero="showcase"]', {
          y: -10,
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.8,
        });

        // Subtle parallax on the background wash while scrolling away (desktop only)
        gsap.to('[data-hero="bg"]', {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
