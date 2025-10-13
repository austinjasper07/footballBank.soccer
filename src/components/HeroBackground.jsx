"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroBackground() {
  const [index, setIndex] = useState(0);
  // const images = ["/heroPhotos/WhatsApp Image 2025-10-07 at 23.49.32_5d88ced2.jpg", "/heroPhotos/WhatsApp Image 2025-10-07 at 23.59.12_d7afb017.jpg"];
  const images = ["/ball-bg.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Background ${i}`}
            fill
            className="object-cover object-center"
            priority={i === 0}
            quality={90}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40" /> readability overlay
    </div>
  );
}
