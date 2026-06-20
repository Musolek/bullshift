"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PALETTE = { bg: "#FFF4E0", text: "#1A1330", muted: "#5B5078", accent: "#A8311A", accentBright: "#FF6B6B", border: "#1A1330" };

const Footer = ({ palette = DEFAULT_PALETTE }) => {
  const currentYear = new Date().getFullYear();
  const [showLogoStory, setShowLogoStory] = useState(false);
  const links = [
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy', href: '/privacy' },
  ];

  return (
    <footer style={{ width: "100%", backgroundColor: palette.text, color: palette.bg, marginTop: "auto", userSelect: "none", paddingTop: "56px" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem 3rem", display: "grid", gridTemplateColumns: "repeat(1, minmax(0, 1fr))", gap: "2rem" }} className="md:grid-cols-3">

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: palette.bg }}>BullShift!</span>
          <motion.button
            onClick={() => setShowLogoStory(true)}
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            style={{ width: "fit-content", background: "none", border: "none", padding: 0, cursor: "pointer" }}
            aria-label="Why this logo? Click to learn the story"
            title="Why this logo?"
          >
            <img src="/logo.png" alt="BullShift Logo" style={{ width: "60px", height: "auto", borderRadius: 12, pointerEvents: "none" }} />
          </motion.button>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", opacity: 0.75, maxWidth: "20rem", lineHeight: 1.6 }}>
            We handle the strategic translation of corporate dialect into raw human utility. No algorithms were rented to produce your copy.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", opacity: 0.6, textTransform: "uppercase" }}>Pages</span>
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{ width: "fit-content", padding: "8px 18px", borderRadius: 999, background: palette.accentBright, color: palette.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", opacity: 0.7 }}>
          <span style={{ letterSpacing: "0.1em", opacity: 0.9, textTransform: "uppercase" }}>Status</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", borderRadius: 16, padding: "14px", border: `2px solid ${palette.bg}` }}>
            <div>Engine: online</div>
            <div>Data retention: zero</div>
            <div>Cookies collected: none</div>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", borderTop: `2px solid ${palette.bg}`, padding: "14px 0", overflow: "hidden", position: "relative", display: "flex", alignItems: "center" }}>
        <div className="ticker-wrap" style={{ width: "100%", display: "flex", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.15em", opacity: 0.6, textTransform: "uppercase" }}>
          <div className="animate-ticker ticker-content" style={{ display: "inline-flex", gap: "2rem", flexShrink: 0, paddingRight: "2rem" }}>
            <span>★ BULLSHIFT CORE SYSTEM ACTIVE</span>
            <span>★ OWN YOUR WORDS OVER THE ALGORITHM</span>
            <span>★ NO COOKIES COLLECTED</span>
            <span>★ COPYRIGHT {currentYear} ALL RIGHTS RESERVED</span>
          </div>
          <div className="animate-ticker ticker-content" style={{ display: "inline-flex", gap: "2rem", flexShrink: 0, paddingRight: "2rem" }} aria-hidden="true">
            <span>★ BULLSHIFT CORE SYSTEM ACTIVE</span>
            <span>★ OWN YOUR WORDS OVER THE ALGORITHM</span>
            <span>★ NO COOKIES COLLECTED</span>
            <span>★ COPYRIGHT {currentYear} ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLogoStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoStory(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#FFF4E0", color: "#1A1330", maxWidth: 460, width: "100%", borderRadius: 24, border: "4px solid #1A1330", boxShadow: "8px 8px 0 #1A1330", padding: "32px", position: "relative", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <button
                onClick={() => setShowLogoStory(false)}
                aria-label="Close"
                style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", border: "2px solid #1A1330", background: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 14 }}
              >
                ✕
              </button>

              <img src="/logo.png" alt="" style={{ width: "56px", height: "auto", marginBottom: 16 }} />

              <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 20, marginBottom: 14, lineHeight: 1.2 }}>
                Why a single unbroken line?
              </h3>

              <p style={{ fontSize: 14.5, lineHeight: 1.65, marginBottom: 14 }}>
                The mark is drawn in one continuous stroke, never lifting the pen — a nod to <strong>lusona</strong>, the sand-drawing tradition of the Chokwe people of Angola and the DRC, where storytellers trace geometric figures in a single unbroken line to encode ancestral knowledge and pass stories down.
              </p>

              <p style={{ fontSize: 14.5, lineHeight: 1.65, marginBottom: 20 }}>
                That idea — memory carried forward in an unbroken thread — is also the spine of my novel, <strong>The Current's Edge</strong>: a mythic YA story where rivers hold memory and power flows through bloodlines, and where inheritance, displacement, and a language older than words all collide.
              </p>

              <div style={{ padding: "14px 18px", borderRadius: 16, border: "2px solid #1A1330", background: "#FFD93D", fontWeight: 700, fontSize: 13.5 }}>
                📖 The Current's Edge — coming soon. Sign up for updates on the author page.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
