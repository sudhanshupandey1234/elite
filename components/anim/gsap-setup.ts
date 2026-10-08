'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined' && !(gsap as any)._egRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  (gsap as any)._egRegistered = true;
}

export { gsap, ScrollTrigger };
