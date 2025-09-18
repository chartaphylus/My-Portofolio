"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Deteksi mobile (tidak ada hover + pointer kasar = touch)
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);

    if (mq.matches) return; // jangan aktifkan listener di mobile

    const cursor = document.getElementById("custom-cursor");
    const outline = document.getElementById("cursor-outline");

    const moveCursor = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (outline) {
        outline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  if (isMobile) return null; // 🚀 Tidak render apapun di mobile

  return (
    <>
      {/* Titik utama */}
      <div
        id="custom-cursor"
        className="cursor-dot fixed top-0 left-0 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full pointer-events-none z-[9999]"
      ></div>

      {/* Outline */}
      <div
        id="cursor-outline"
        className="cursor-outline fixed top-0 left-0 w-8 h-8 border-2 border-cyan-400/50 rounded-full pointer-events-none z-[9998]"
      ></div>
    </>
  );
}
