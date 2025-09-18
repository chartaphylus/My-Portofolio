"use client";

import { useState, useEffect } from "react";
import IntroAnimation from "./IntroAnimation";

export default function IntroProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 6000); // 6 detik
    return () => clearTimeout(timer);
  }, []);

  return <>{showIntro ? <IntroAnimation /> : children}</>;
}
