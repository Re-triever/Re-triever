import React from 'react';

export function PacmanLogo({ className = "w-8 h-8" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_0_8px_#FFE600]">
        {/* Top Jaw */}
        <path
          d="M 16 16 L 31 7 A 15 15 0 1 0 16 31 Z"
          fill="#FFE600"
          className="animate-chomp-top"
        />
        {/* Bottom Jaw */}
        <path
          d="M 16 16 L 31 25 A 15 15 0 1 1 16 1 Z"
          fill="#FFE600"
          className="animate-chomp-bottom"
        />
      </svg>
    </div>
  );
}

export function GhostIcon({ color = "red", className = "w-5 h-5", animate = true }) {
  const colorMap = {
    red: "#FF0044",    // Blinky
    pink: "#FF66CC",   // Pinky
    cyan: "#00FFFF",   // Inky
    orange: "#FF9900", // Clyde
    blue: "#2121DE",   // Scared Ghost Mode
    yellow: "#FFE600"  // Power Mode
  };

  const hexColor = colorMap[color] || colorMap.red;

  return (
    <div className={`relative ${className} ${animate ? 'animate-ghost' : ''}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
        {/* Ghost Body */}
        <path
          d="M 6 16 A 10 10 0 0 1 26 16 L 26 28 L 22.6 25 L 19.3 28 L 16 25 L 12.6 28 L 9.3 25 L 6 28 Z"
          fill={hexColor}
        />
        {/* Eyes Outer */}
        <circle cx="11" cy="13" r="3.5" fill="#FFFFFF" />
        <circle cx="21" cy="13" r="3.5" fill="#FFFFFF" />
        {/* Pupils */}
        <circle cx="12" cy="13" r="1.8" fill="#0000FF" />
        <circle cx="22" cy="13" r="1.8" fill="#0000FF" />
      </svg>
    </div>
  );
}

export function PowerPellet({ className = "w-3 h-3" }) {
  return (
    <div className={`rounded-full bg-[#FFE600] animate-pellet shadow-[0_0_8px_#FFE600] ${className}`} />
  );
}

export function PacmanDot({ className = "w-1.5 h-1.5" }) {
  return (
    <div className={`rounded-full bg-[#FFE600] opacity-80 ${className}`} />
  );
}
