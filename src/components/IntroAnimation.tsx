"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 2000), 
      setTimeout(() => setStep(2), 4000), 
      setTimeout(() => setIsLoading(false), 6000), 
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Step 0: Karakter */}
          {step === 0 && (
            <div className="relative">
              {/* Orbit effect */}
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                <div className="w-72 h-72 border-2 border-dashed border-purple-500 rounded-full"></div>
                {/* Titik partikel */}
                <div className="absolute top-0 w-4 h-4 bg-purple-400 rounded-full shadow-lg"></div>
              </div>

              {/* Gambar Karakter */}
              <motion.img
                src="/image/Character.JPG"
                alt="Character"
                className="w-56 h-56 object-cover rounded-full border-4 border-white shadow-xl relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 1 }}
              />
            </div>
          )}

          {/* Step 1: Logo */}
          {step === 1 && (
            <div className="relative">
              {/* Orbit effect */}
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                <div className="w-52 h-52 border-2 border-dashed border-blue-400 rounded-full"></div>
                {/* Titik partikel */}
                <div className="absolute top-0 w-3 h-3 bg-blue-300 rounded-full shadow-md"></div>
              </div>

              {/* Gambar Logo */}
              <motion.img
                src="/image/logo.png"
                alt="Logo"
                className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg relative z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
              />
            </div>
          )}

          {/* Step 2: Welcome */}
          {step === 2 && (
            <motion.h1
              className="text-5xl tracking-wide md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight animate-pulse text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to My Portfolio
            </motion.h1>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
