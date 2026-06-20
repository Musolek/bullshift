"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PALETTES = [
  { id: "cream", name: "Cream", bg: "#FFF4E0", text: "#1A1330", muted: "#5B5078", accent: "#A8311A", accentBright: "#FF6B6B", border: "#1A1330" },
  { id: "teal", name: "Teal", bg: "#E3FBF7", text: "#0B3D38", muted: "#3A6F68", accent: "#0B6E64", accentBright: "#4ECDC4", border: "#0B3D38" },
  { id: "sun", name: "Sun", bg: "#FFF1B8", text: "#3D2B00", muted: "#7A5C12", accent: "#A8311A", accentBright: "#FFD93D", border: "#3D2B00" },
  { id: "bubblegum", name: "Bubblegum", bg: "#FFE3F0", text: "#3D0C24", muted: "#7A3358", accent: "#0B6E64", accentBright: "#4ECDC4", border: "#3D0C24" },
  { id: "dark", name: "Dark", bg: "#1A1330", text: "#FFF4E0", muted: "#C9C2E0", accent: "#FFD93D", accentBright: "#FF6B6B", border: "#FFF4E0" },
];

const Header = ({ isTyping = false, jargonDensity = 0, palette, setPalette }) => {
  const isAlert = isTyping || jargonDensity > 30;

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", backgroundColor: palette.bg, borderBottom: `4px solid ${palette.border}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
      <Link
        href="/"
        style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", letterSpacing: "-0.01em", cursor: "pointer", textDecoration: "none", color: palette.text }}
      >
        BullShift!
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <nav style={{ display: "none", gap: "10px" }} className="md:flex md:items-center">
          {[["About", "/about"], ["FAQ", "/faq"]].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{ padding: "8px 16px", borderRadius: 999, background: palette.text, color: palette.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginLeft: "8px", paddingLeft: "12px", borderLeft: `2px solid ${palette.border}` }}>
          {PALETTES.map((p) => (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.15, rotate: -6 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => setPalette(p)}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: palette.id === p.id ? `3px solid ${palette.text}` : `2px solid ${palette.border}`,
                background: p.bg,
                cursor: "pointer",
                minWidth: 44,
                minHeight: 44,
              }}
              title={p.name}
            />
          ))}
        </div>

        <motion.div
          animate={isAlert ? { rotate: [0, -4, 4, -4, 0] } : {}}
          transition={{ duration: 0.4, repeat: isAlert ? Infinity : 0, repeatDelay: 0.6 }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.03em",
            padding: "8px 14px",
            borderRadius: 999,
            border: `2px solid ${palette.border}`,
            background: isAlert ? palette.accentBright : palette.bg,
            color: isAlert ? palette.border : palette.text,
          }}
        >
          {isAlert ? `🔥 ${jargonDensity}% jargon` : '✓ ready'}
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
