"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { resolveImageUrl } from "@/lib/image-utils";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export default function ImageModal({ isOpen, onClose, images, initialIndex = 0 }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden">
      
      {/* Background overlay with blur, not solid black */}
      <div 
        className="absolute inset-0 bg-[var(--theme-bg)]/60 backdrop-blur-2xl animate-in fade-in duration-500 cursor-zoom-out" 
        onClick={onClose}
      ></div>

      {/* Main Container - Absolute Center */}
      <div className="relative z-10 flex items-center justify-center pointer-events-none w-full h-full">
        
        {/* Image Frame Wrapper */}
        <div className="relative max-w-[98vw] max-h-[98vh] animate-in zoom-in-95 duration-500 pointer-events-auto flex items-center justify-center">
          
          <button 
            onClick={onClose}
            className="fixed top-6 right-6 md:top-8 md:right-8 w-12 h-12 rounded-full bg-[var(--theme-text)]/10 text-[var(--theme-text)] flex items-center justify-center hover:bg-[var(--theme-primary)] hover:text-white hover:scale-110 transition-all z-[130] shadow-xl backdrop-blur-md cursor-pointer pointer-events-auto"
          >
            <FaTimes size={20} />
          </button>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-[var(--theme-text)]/10">
            <img
              src={resolveImageUrl(images[currentIndex])}
              alt="Full view"
              className="max-w-[95vw] max-h-[90vh] object-contain block select-none"
            />
          </div>

          {/* Navigation - only if multiple images */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-[var(--theme-primary)] transition-all shadow-2xl"
              >
                <FaChevronLeft size={20} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-[var(--theme-primary)] transition-all shadow-2xl"
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="mt-8 flex justify-center gap-3 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-[var(--theme-primary)] shadow-[0_0_15px_var(--theme-primary)]' : 'w-2.5 bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
