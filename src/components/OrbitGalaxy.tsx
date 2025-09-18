"use client";

import React from "react";

interface OrbitGalaxyProps {
  children: React.ReactNode;
  className?: string;
}

const OrbitGalaxy: React.FC<OrbitGalaxyProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Orbit Rings (wrap each ring with helper classes) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer Orbit Ring */}
        <div className="absolute w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 border border-cyan-400/20 rounded-full orbit-ring orbit-outer">
          {/* orbit particles (use smaller sizes and different delays) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg animate-pulse delay-1000"></div>
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-lg animate-pulse delay-2000"></div>
        </div>

        {/* Middle Orbit Ring */}
        <div className="absolute w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 border border-purple-400/20 rounded-full orbit-ring orbit-middle">
          <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-lg animate-pulse delay-500"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-300 rounded-full shadow-lg animate-pulse delay-1500"></div>
        </div>

        {/* Inner Orbit Ring */}
        <div className="absolute w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 border border-blue-400/20 rounded-full orbit-ring orbit-inner">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-200 rounded-full shadow-lg animate-pulse delay-750"></div>
        </div>

        {/* Floating Particles (wrap in responsive container) */}
        <div className="absolute w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 orbit-particles pointer-events-none">
          <div className="absolute top-6 left-6 w-1 h-1 bg-cyan-400/60 rounded-full animate-float-1"></div>
          <div className="absolute top-16 right-12 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-float-2"></div>
        </div>

        {/* Glow layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-pink-500/10 rounded-full blur-lg animate-pulse-slow delay-2000"></div>
      </div>

      {/* Content (Profile Image) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OrbitGalaxy;
