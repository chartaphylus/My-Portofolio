"use client";

import React, { useEffect, useState } from 'react';

const PerformanceOptimizer: React.FC = () => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check for low performance devices
    const checkPerformance = () => {
      // Check for low-end devices
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 || // Low CPU cores
        (navigator as any).deviceMemory <= 2 || // Low RAM
        /Android.*Chrome\/[0-5]/.test(navigator.userAgent); // Old Android Chrome

      setIsLowPerformance(isLowEnd);
    };

    checkPerformance();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    // Apply performance optimizations
    const root = document.documentElement;
    
    if (isReducedMotion || isLowPerformance) {
      root.style.setProperty('--animation-duration', '0.1s');
      root.style.setProperty('--animation-delay', '0s');
      
      // Disable complex animations
      const complexAnimations = document.querySelectorAll('.animate-spin-slow, .animate-spin-reverse-slow, .animate-float-1, .animate-float-2, .animate-float-3, .animate-float-4, .animate-float-5, .animate-float-6');
      complexAnimations.forEach(el => {
        (el as HTMLElement).style.animation = 'none';
      });
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--animation-delay');
    }
  }, [isReducedMotion, isLowPerformance]);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;

