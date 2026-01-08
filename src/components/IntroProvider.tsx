"use client";

import { useState, useEffect } from "react";
import IntroAnimation from "./IntroAnimation";

export default function IntroProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showIntro, setShowIntro] = useState(true);

  const handleAnimationComplete = () => {
    setShowIntro(false);
  }; // removed useCallback usage as it might need refactor import, doing it simpler by fixing Dependency first


  return <>{showIntro ? <IntroAnimation onComplete={handleAnimationComplete} /> : children}</>;
}
