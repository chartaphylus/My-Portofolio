"use client";

import React from 'react';
import { FaCode, FaLaptop, FaMobile, FaDatabase, FaCloud, FaGitAlt } from 'react-icons/fa';
import { SiReact, SiNextdotjs, SiTailwindcss, SiJavascript } from 'react-icons/si';

const FloatingElements: React.FC = () => {
  const floatingIcons = [
    { Icon: FaCode, position: 'top-20 left-10', delay: '0s', color: 'text-cyan-400' },
    { Icon: SiReact, position: 'top-32 right-16', delay: '1s', color: 'text-blue-400' },
    { Icon: FaLaptop, position: 'top-1/3 left-1/4', delay: '2s', color: 'text-purple-400' },
    { Icon: SiNextdotjs, position: 'top-1/2 right-1/3', delay: '3s', color: 'text-gray-300' },
    { Icon: FaMobile, position: 'bottom-1/3 left-16', delay: '4s', color: 'text-green-400' },
    { Icon: SiTailwindcss, position: 'bottom-32 right-20', delay: '5s', color: 'text-sky-400' },
    { Icon: FaDatabase, position: 'bottom-20 left-1/3', delay: '6s', color: 'text-orange-400' },
    { Icon: SiJavascript, position: 'top-2/3 right-12', delay: '7s', color: 'text-yellow-400' },
    { Icon: FaCloud, position: 'top-1/4 right-1/4', delay: '8s', color: 'text-indigo-400' },
    { Icon: FaGitAlt, position: 'bottom-1/4 right-1/4', delay: '9s', color: 'text-red-400' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className={`absolute ${item.position} opacity-20 hover:opacity-40 transition-opacity duration-300`}
          style={{
            animation: `float-gentle 8s ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          <item.Icon 
            className={`text-2xl ${item.color} drop-shadow-lg`}
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}
          />
        </div>
      ))}
      
      {/* Additional decorative particles */}
      <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-cyan-400/30 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-3/4 left-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '6s' }}></div>
      <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-ping" style={{ animationDelay: '8s' }}></div>
    </div>
  );
};

export default FloatingElements;

