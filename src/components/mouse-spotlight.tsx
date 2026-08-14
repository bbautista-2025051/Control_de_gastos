"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";

type MouseSpotlightProps = {
  children: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
};

export function MouseSpotlight({
  children,
  className = "",
  size = 360,
  color = "rgba(16, 185, 129, 0.16)",
}: MouseSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 120, damping: 24 });
  const sy = useSpring(my, { stiffness: 120, damping: 24 });

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${sx}% ${sy}%, ${color}, transparent 72%)`;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((event.clientX - rect.left) / rect.width) * 100);
    my.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
