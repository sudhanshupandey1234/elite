'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from './gsap-setup';
import { motionPrefs, calm } from './motion';

/**
 * Subtle image reveal: gentle scale-down + fade the first time the image
 * scrolls into view. Preserves layout (transform/opacity only).
 */
export function ImgReveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const { reduced, mobile } = motionPrefs();
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(root, {
        scale: 1.05,
        autoAlpha: 0,
        duration: mobile ? 0.6 : 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 85%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
