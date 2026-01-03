"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest(".link-card") ||
        target.closest(".contact-button") ||
        target.style.cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const size = isHovering ? 40 : 28;

  return (
    <div
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {isClicking ? (
        // Click cursor with ripple effects
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          width={size} 
          height={size} 
          fill="rgba(60, 60, 65, 0.95)" 
          stroke="rgba(255, 255, 255, 0.3)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))",
            transition: "width 0.15s ease, height 0.15s ease",
          }}
        >
          <path d="M14 4.1L12 6M5.1 8l-2.9-.8M6 12l-1.9 2M7.2 2.2L8 5.1m1.037 4.59a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>
        </svg>
      ) : (
        // Normal cursor
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          width={size} 
          height={size} 
          fill="rgba(60, 60, 65, 0.95)" 
          stroke="rgba(255, 255, 255, 0.3)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))",
            transition: "width 0.15s ease, height 0.15s ease",
          }}
        >
          <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>
        </svg>
      )}
    </div>
  );
}
