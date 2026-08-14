"use client";

import { useEffect, useRef } from "react";

const COLORS = ["16, 185, 129", "34, 211, 238", "167, 139, 250"];

type Particle = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
  color: string;
  alpha: number;
};

export function FloatingParticles({ count = 24 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const el = canvas;
    const context = ctx;
    let raf = 0;
    let particles: Particle[] = [];

    function resize() {
      const parent = el.parentElement;
      if (!parent) return;
      el.width = parent.clientWidth;
      el.height = parent.clientHeight;

      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * el.width,
          y: Math.random() * el.height,
          radius: 1 + Math.random() * 2,
          speed: 0.12 + Math.random() * 0.35,
          drift: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          color: COLORS[i % COLORS.length],
          alpha: 0.25 + Math.random() * 0.55,
        });
      }
    }

    function tick(time: number) {
      context.clearRect(0, 0, el.width, el.height);

      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = el.height + 10;
          p.x = Math.random() * el.width;
        }

        const sway = Math.sin(time / 900 + p.phase) * p.drift;
        context.beginPath();
        context.arc(p.x + sway, p.y, p.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        context.shadowBlur = 8;
        context.shadowColor = `rgba(${p.color}, 0.8)`;
        context.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
