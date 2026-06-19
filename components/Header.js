"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const PALETTES = [
  { id: "tan", name: "Tan", bg: "#F5F0E8", text: "#1A1714", muted: "#6B6560", accent: "#F0B429", border: "#1A1714" },
  { id: "purple", name: "Purple", bg: "#3D348B", text: "#F0E2E7", muted: "#C7BAD6", accent: "#F7B801", border: "#F0E2E7" },
  { id: "yellow", name: "Gold", bg: "#F7B801", text: "#1B1F3B", muted: "#4A4A2A", accent: "#F35B04", border: "#1B1F3B" },
  { id: "orange", name: "Orange", bg: "#8A2F02", text: "#F5EAE5", muted: "#DDBBAE", accent: "#FFC23A", border: "#F5EAE5" },
  { id: "pink", name: "Pink", bg: "#F0E2E7", text: "#1B1F3B", muted: "#5E5853", accent: "#F35B04", border: "#3D348B" },
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
    <header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", height: "60px", backgroundColor: "#000000", borderBottom: "1px solid #262626", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)" }}>
      {/* Left: Branding with hover state */}
      <Link 
        href="/"
        style={{ fontFamily: "'Clash Display', Inter, system-ui, sans-serif", fontStyle: "normal", fontWeight: 600, fontSize: "24px", lineHeight: "32px", letterSpacing: "-0.02em", cursor: "pointer", transition: "color 0.15s", userSelect: "none", textDecoration: "none", color: isAlert ? '#ff1e43' : '#ffffff' }}
        onMouseEnter={() => triggerScramble(true)}
        onMouseLeave={() => triggerScramble(false)}
      >
        {logoText}
      </Link>

      {/* Right: Navigation & Global Reactive Status Pill */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <nav style={{ display: "none" }} className="md:flex md:items-center md:gap-6">
          <Link href="/about" style={{ fontFamily: "'IBM Plex Mono', monospace", fontStyle: "normal", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#737373", textDecoration: "none", transition: "color 0.15s" }} className="hover:text-white">About</Link>
          <Link href="/faq" style={{ fontFamily: "'IBM Plex Mono', monospace", fontStyle: "normal", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#737373", textDecoration: "none", transition: "color 0.15s" }} className="hover:text-white">FAQ</Link>
          <Link href="/privacy" style={{ fontFamily: "'IBM Plex Mono', monospace", fontStyle: "normal", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#737373", textDecoration: "none", transition: "color 0.15s" }} className="hover:text-white">Privacy</Link>
        </nav>

        {/* Palette Toggle */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginLeft: "12px", paddingLeft: "12px", borderLeft: "1px solid #262626" }}>
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
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontStyle: "normal",
            fontSize: "0.625rem",
            letterSpacing: "0.05em",
            padding: "0.25rem 0.75rem",
            border: "1px solid",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: isAlert ? "rgba(255, 30, 67, 0.1)" : "#0a0a0a",
            borderColor: isAlert ? "#ff1e43" : "#262626",
            color: isAlert ? "#ff1e43" : "#00ff66",
            boxShadow: isAlert ? "0 0 15px rgba(255, 30, 67, 0.35), 0 0 30px rgba(255, 30, 67, 0.1)" : "0 0 15px rgba(0, 255, 102, 0.25)"
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isAlert ? "#ff1e43" : "#00ff66", animation: isAlert ? "pulse 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite" : "none" }} />
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
