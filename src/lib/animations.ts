"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook that creates a scroll-triggered reveal animation for an element.
 * Respects prefers-reduced-motion.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: {
    y?: number;
    x?: number;
    opacity?: number;
    scale?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
    stagger?: number;
    once?: boolean;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      scale = 1,
      duration = 0.8,
      delay = 0,
      ease = "power3.out",
      start = "top 85%",
      once = true,
    } = options;

    gsap.set(el, { y, x, opacity, scale });

    const anim = gsap.to(el, {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: once
          ? "play none none none"
          : "play reverse play reverse",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [options.y, options.x, options.opacity, options.scale, options.duration, options.delay, options.ease, options.start, options.stagger, options.once]);

  return ref;
}

/**
 * Hook for staggered children animations on scroll.
 */
export function useScrollStagger<T extends HTMLElement>(
  childSelector: string,
  options: {
    y?: number;
    opacity?: number;
    scale?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const {
      y = 30,
      opacity = 0,
      scale = 0.97,
      duration = 0.6,
      stagger = 0.1,
      ease = "power3.out",
      start = "top 85%",
    } = options;

    const children = el.querySelectorAll(childSelector);
    gsap.set(children, { y, opacity, scale });

    const anim = gsap.to(children, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [childSelector, options.y, options.opacity, options.scale, options.duration, options.stagger, options.ease, options.start]);

  return ref;
}

/**
 * Hook for parallax scroll effect.
 */
export function useParallax<T extends HTMLElement>(speed: number = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const anim = gsap.to(el, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [speed]);

  return ref;
}
