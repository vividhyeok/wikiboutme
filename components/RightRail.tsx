"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ads = [
  { src: "/ad-kimchi.png", alt: "깊고 진한 김치의 맛 광고" },
  { src: "/ad-bookcafe.png", alt: "책과 커피가 머무는 공간 광고" },
  { src: "/ad-notebook.png", alt: "가볍고 빠른 노트북 광고" },
];

export default function RightRail() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setIndex(Math.floor(Math.random() * ads.length)), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const ad = ads[index];
  return (
    <aside className="right-rail" aria-label="광고">
      <div className="rail-ad-label">ADVERTISEMENT</div>
      <div className="rail-ad">
        <Image src={ad.src} alt={ad.alt} width={684} height={2048} sizes="260px" priority />
      </div>
    </aside>
  );
}
