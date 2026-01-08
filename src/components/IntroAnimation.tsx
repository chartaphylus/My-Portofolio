"use client"
import { useState, useEffect } from "react"

interface IntroAnimationProps {
  onComplete?: () => void
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<"galaxy" | "logo" | "text" | "finish">("galaxy")

  // Fix hydration issue by generating particles only on client side
  const [particles, setParticles] = useState<Array<{ angle: number, radius: number, size: number, delay: number }>>([])
  const [stars, setStars] = useState<Array<{ angle: number, radius: number, size: number }>>([])

  useEffect(() => {
    // Generate particles on mount (client-only)
    setParticles([...Array(60)].map((_, i) => ({
      angle: (i / 60) * 360,
      radius: 50 + Math.random() * 200,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2
    })))

    setStars([...Array(40)].map((_, i) => ({
      angle: (i / 40) * 360,
      radius: 80 + Math.random() * 150,
      size: Math.random() * 2 + 1
    })))
  }, [])

  // Handle stage transitions with a single robust timeline
  useEffect(() => {
    // Stage 0: Galaxy is default

    // Stage 1: Switch to Logo after 4 seconds
    const timer1 = setTimeout(() => {
      setStage("logo")
    }, 4000)

    // Stage 2: Switch to Text after Logo (+1.5s = 5.5s total)
    const timer2 = setTimeout(() => {
      setStage("text")
    }, 5500)

    // Stage 3: Finish after Text (+2.5s = 8s total)
    const timer3 = setTimeout(() => {
      setStage("finish")
      console.log("Animation Complete")
      if (onComplete) onComplete()
    }, 8000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, []) // Empty dependency array ensures it runs ONCE on mount

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-[9999] overflow-hidden">
      {/* Stage 1: Galaxy Particle Effect - Delicate & Professional */}
      <div className={`absolute inset-0 flex items-center justify-center w-full h-full perspective-[1000px] transition-opacity duration-1000 ${stage === 'finish' ? 'opacity-0' : 'opacity-100'}`}>
        {/* Background Gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

        <div className="relative flex items-center justify-center animate-spin-slow">
          {/* Core - Bright & Glowing */}
          <div className="absolute w-12 h-12 bg-white rounded-full blur-md shadow-[0_0_60px_rgba(167,139,250,0.9)] z-30"></div>
          <div className="absolute w-24 h-24 bg-purple-500/20 rounded-full blur-xl z-20 animate-pulse"></div>

          {/* Galaxy Cloud - Hundreds of small particles for 'lighter' feel */}
          <div className="absolute w-[600px] h-[600px] rounded-full animate-spin-slow">
            {particles.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-blue-300 shadow-[0_0_5px_rgba(147,197,253,0.8)]"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${p.angle}deg) translate(${p.radius}px) rotate(-${p.angle}deg)`,
                  animation: `twinkle 3s infinite ${p.delay}s ease-in-out`
                }}
              />
            ))}
          </div>

          {/* Second Layer - Purple Stars */}
          <div className="absolute w-[500px] h-[500px] rounded-full animate-spin-reverse">
            {stars.map((s, i) => (
              <div
                key={`p2-${i}`}
                className="absolute rounded-full bg-purple-400"
                style={{
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${s.angle}deg) translate(${s.radius}px) rotate(-${s.angle}deg)`,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        </div>
      </div>


      {/* Stage 2 & 3: Logo and Text */}
      {(stage === "logo" || stage === "text") && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo container */}
          <div className="relative mb-8" style={{ animation: 'fadeZoomIn 1s ease-out forwards' }}>
            <div className="absolute inset-0 bg-purple-600 blur-[60px] opacity-30 rounded-full"></div>
            <img
              src="/image/Logo.png"
              alt="Logo"
              className="w-40 h-40 object-contain drop-shadow-2xl relative z-10"
            />
          </div>

          {/* Welcome Text */}
          {stage === "text" && (
            <div className="text-center" style={{ animation: 'slideUp 1s ease-out forwards' }}>
              <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">Welcome</h1>
              <p className="text-cyan-400 tracking-widest uppercase text-sm">To My Portfolio</p>
            </div>
          )}
        </div>
      )}

      {/* Custom CSS for twinkle animation */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fadeZoomIn {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
