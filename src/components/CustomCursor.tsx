/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [hidden, setHidden] = useState(true);
  const [hoverType, setHoverType] = useState<'none' | 'clickable' | 'card'>('none');

  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Detect mobile / touch pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      if (hidden) setHidden(false);
    };

    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    // Dynamic scale handlers based on hovering elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        target.closest('input') !== null ||
        target.closest('textarea') !== null ||
        target.closest('[role="button"]') !== null;

      const isProjectCard = target.closest('.project-card') !== null;

      if (isClickable) {
        setHoverType('clickable');
      } else if (isProjectCard) {
        setHoverType('card');
      } else {
        setHoverType('none');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    // Animation Loop
    let animationFrameId: number;
    const lerpRate = 0.15; // smooth lag coefficient

    const updatePosition = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        // Dot moves instantly
        dot.style.transform = `translate3d(${mouseCoords.current.x - 4}px, ${mouseCoords.current.y - 4}px, 0)`;

        // Ring moves with lerp interpolation
        ringCoords.current.x += (mouseCoords.current.x - ringCoords.current.x) * lerpRate;
        ringCoords.current.y += (mouseCoords.current.y - ringCoords.current.y) * lerpRate;

        ring.style.transform = `translate3d(${ringCoords.current.x - 16}px, ${ringCoords.current.y - 16}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <>
      {/* Tiny solid dot */}
      <div
        id="cursor-dot"
        ref={dotRef}
        className={`custom-cursor pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 rounded-full bg-white transition-opacity duration-300 ${
          hoverType === 'clickable' ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {/* Lag-following outer ring */}
      <div
        id="cursor-ring"
        ref={ringRef}
        className={`custom-cursor pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-white transition-all duration-300 ${
          hoverType === 'clickable'
            ? 'h-12 w-12 border-2 bg-transparent opacity-100 scale-125'
            : hoverType === 'card'
            ? 'h-10 w-10 bg-white/10 border-white/40'
            : 'h-8 w-8 bg-transparent opacity-50'
        }`}
      />
    </>
  );
}
