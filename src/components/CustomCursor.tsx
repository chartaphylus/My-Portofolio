"use client";

import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
  const updateMousePosition = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseDown = () => setIsClicking(true);
  const handleMouseUp = () => setIsClicking(false);

  const handleMouseEnter = (e: MouseEvent) => {
    const target = e.target as Element | null;
    if (target instanceof HTMLElement) {
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList?.contains('hover-target')
      ) {
        setIsHovering(true);
      }
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const target = e.target as Element | null;
    if (target instanceof HTMLElement) {
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList?.contains('hover-target')
      ) {
        setIsHovering(false);
      }
    }
  };

  // Add event listeners
  document.addEventListener('mousemove', updateMousePosition);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseenter', handleMouseEnter, true);
  document.addEventListener('mouseleave', handleMouseLeave, true);

  // Hide default cursor
  document.body.style.cursor = 'none';

  return () => {
    document.removeEventListener('mousemove', updateMousePosition);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mouseenter', handleMouseEnter, true);
    document.removeEventListener('mouseleave', handleMouseLeave, true);
    document.body.style.cursor = 'auto';
  };
}, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x - 4,
          top: mousePosition.y - 4,
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
          transition: 'transform 0.1s ease',
        }}
      >
        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
      </div>

      {/* Cursor outline */}
      <div
        className="fixed pointer-events-none z-[9998] border-2 border-cyan-400/50 rounded-full mix-blend-difference"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
          transition: 'all 0.15s ease',
          background: isHovering ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
        }}
      ></div>

      {/* Galaxy trail effect */}
      <div
        className="fixed pointer-events-none z-[9997]"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
        }}
      >
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-md animate-pulse"></div>
      </div>
    </>
  );
};

export default CustomCursor;

