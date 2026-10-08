'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from './gsap-setup';

interface StaggerInProps {
  children: ReactNode;
  className?: string;
  /** vertical travel distance in px */
  y?: number;
  /** delay between items in seconds */
  stagger?: number;
}

/**
 * Wraps a grid/list; children marked with `data-stagger-item` rise + fade
 * in with a GSAP stagger the first time the group scrolls into view.
 */
export function StaggerIn({ children, className = '', y = 30, stagger = 0.09 }: StaggerInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = root.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y,
        autoAlpha: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: root, start: 'top 82%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [y, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
