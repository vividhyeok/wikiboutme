"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle({ defaultTheme = "light" }: { defaultTheme?: "system" | "light" | "dark" }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("wikiboutme-theme");
      const value = saved ? saved === "dark" : defaultTheme === "dark";
      document.documentElement.dataset.theme = value ? "dark" : "light";
      setDark(value);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [defaultTheme]);
  function toggle() { const value = !dark; setDark(value); document.documentElement.dataset.theme = value ? "dark" : "light"; localStorage.setItem("wikiboutme-theme", value ? "dark" : "light"); }
  return <button className="icon-button" type="button" onClick={toggle} aria-label={dark ? "라이트 모드" : "다크 모드"}>{dark ? "☀" : "☾"}</button>;
}
