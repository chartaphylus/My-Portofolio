"use client";

import React from 'react';

interface OrbitGalaxyProps {
  children: React.ReactNode;
  className?: string;
}

const OrbitGalaxy: React.FC<OrbitGalaxyProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Orbit Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer Orbit Ring */}
        <div className="absolute w-80 h-80 border border-cyan-400/20 rounded-full animate-spin-slow">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 animate-pulse delay-1000"></div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-pulse delay-2000"></div>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50 animate-pulse delay-3000"></div>
        </div>

        {/* Middle Orbit Ring */}
        <div className="absolute w-64 h-64 border border-purple-400/20 rounded-full animate-spin-reverse-slow">
          <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50 animate-pulse delay-500"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-300 rounded-full shadow-lg shadow-purple-300/50 animate-pulse delay-1500"></div>
          <div className="absolute top-4 left-4 w-1 h-1 bg-blue-300 rounded-full shadow-lg shadow-blue-300/50 animate-pulse delay-2500"></div>
          <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-pink-300 rounded-full shadow-lg shadow-pink-300/50 animate-pulse delay-3500"></div>
        </div>

        {/* Inner Orbit Ring */}
        <div className="absolute w-48 h-48 border border-blue-400/20 rounded-full animate-spin-slow">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-200 rounded-full shadow-lg shadow-cyan-200/50 animate-pulse delay-750"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-purple-200 rounded-full shadow-lg shadow-purple-200/50 animate-pulse delay-1750"></div>
          <div className="absolute left-2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-blue-200 rounded-full shadow-lg shadow-blue-200/50 animate-pulse delay-2750"></div>
          <div className="absolute right-2 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-pink-200 rounded-full shadow-lg shadow-pink-200/50 animate-pulse delay-3750"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute w-96 h-96">
          <div className="absolute top-8 left-8 w-1 h-1 bg-cyan-400/60 rounded-full animate-float-1"></div>
          <div className="absolute top-16 right-12 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-float-2"></div>
          <div className="absolute bottom-12 left-16 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-float-3"></div>
          <div className="absolute bottom-8 right-8 w-1 h-1 bg-pink-400/60 rounded-full animate-float-4"></div>
          <div className="absolute top-1/3 left-4 w-0.5 h-0.5 bg-cyan-300/60 rounded-full animate-float-5"></div>
          <div className="absolute top-2/3 right-4 w-0.5 h-0.5 bg-purple-300/60 rounded-full animate-float-6"></div>
        </div>

        {/* Galaxy Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-pink-500/10 rounded-full blur-2xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Content (Profile Image) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OrbitGalaxy;

