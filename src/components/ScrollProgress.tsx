"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="chaos-meter" aria-hidden="true">
      <span>CAOS</span>
      <div><i style={{ transform: `scaleY(${progress / 100})` }} /></div>
      <b>{Math.round(progress).toString().padStart(2, "0")}</b>
    </div>
  );
}
