"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ defaultTheme = "system" }: { defaultTheme?: "system" | "light" | "dark" }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wikiboutme-theme");
    const shouldDark = saved ? saved === "dark" : defaultTheme === "dark" ? true : defaultTheme === "light" ? false : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = shouldDark ? "dark" : "light";
    setDark(shouldDark);
  }, [defaultTheme]);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("wikiboutme-theme", next ? "dark" : "light");
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label={dark ? "라이트 모드" : "다크 모드"} title={dark ? "라이트 모드" : "다크 모드"}>
      {dark ? "☀" : "◐"}
    </button>
  );
}
