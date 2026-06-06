import React, { useState } from 'react';
import Link from 'next/link';

const PALETTES = [
  { id: "tan", name: "Tan", bg: "#F5F0E8", text: "#1A1714", muted: "#6B6560", accent: "#F0B429", border: "#1A1714" },
  { id: "purple", name: "Purple", bg: "#3D348B", text: "#F0E2E7", muted: "#B8A8C8", accent: "#F7B801", border: "#F0E2E7" },
  { id: "yellow", name: "Gold", bg: "#F7B801", text: "#1B1F3B", muted: "#4A4A2A", accent: "#F35B04", border: "#1B1F3B" },
  { id: "orange", name: "Orange", bg: "#F35B04", text: "#F0E2E7", muted: "#D4A8A8", accent: "#F7B801", border: "#1B1F3B" },
  { id: "pink", name: "Pink", bg: "#F0E2E7", text: "#1B1F3B", muted: "#6B6560", accent: "#F35B04", border: "#3D348B" },
  { id: "dark", name: "Dark", bg: "#1B1F3B", text: "#F0E2E7", muted: "#B8A8C8", accent: "#F7B801", border: "#F0E2E7" },
];

const Header = ({ isTyping = false, jargonDensity = 0, palette, setPalette }) => {
  const [logoText, setLogoText] = useState('BULLSHIFT');
  const isAlert = isTyping || jargonDensity > 30;

  // Simple, instant text scramble simulator for brutalist styling
  const triggerScramble = (hovering) => {
    if (hovering) {
      setLogoText('BS//01');
    } else {
      setLogoText('BULLSHIFT');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-[60px] bg-black border-b border-neutral-900 px-6 flex items-center justify-between select-none shadow-cinematic-low">
      {/* Left: Branding with hover state */}
      <Link 
        href="/"
        className="font-sans font-black tracking-tighter text-xl cursor-pointer transition-colors duration-150 ease-cinematic select-none"
        style={{ color: isAlert ? '#ff1e43' : '#ffffff' }}
        onMouseEnter={() => triggerScramble(true)}
        onMouseLeave={() => triggerScramble(false)}
      >
        {logoText}
      </Link>

      {/* Right: Navigation & Global Reactive Status Pill */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-neutral-500">
          <Link href="/about" className="hover:text-white transition-colors duration-150">About</Link>
          <Link href="/faq" className="hover:text-white transition-colors duration-150">FAQ</Link>
          <Link href="/privacy" className="hover:text-white transition-colors duration-150">Privacy</Link>
        </nav>

        {/* Palette Toggle */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 12, paddingLeft: 12, borderLeft: "1px solid #262626" }}>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPalette(p)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: palette.id === p.id ? "2px solid #ffffff" : "1px solid #262626",
                background: p.bg,
                cursor: "pointer",
                transition: "all 0.2s",
                minWidth: 44,
                minHeight: 44,
              }}
              title={p.name}
            />
          ))}
        </div>

        {/* System Status Indicator Box */}
        <div 
          className={`font-mono text-[10px] tracking-wider px-3 py-1 border transition-all duration-200 ease-cinematic flex items-center gap-2 rounded-none
            ${isAlert 
              ? 'bg-accent-crimson/10 border-accent-crimson text-accent-crimson shadow-glow-crimson' 
              : 'bg-neutral-950 border-neutral-800 text-accent-emerald shadow-glow-emerald'
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-accent-crimson animate-pulse-fast' : 'bg-accent-emerald'}`} />
          <span>
            {isAlert 
              ? `SYS_STATUS: SCRUBBING // METRIC_${jargonDensity}%` 
              : 'SYS_STATUS: READY // NOISE_0%'
            }
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
