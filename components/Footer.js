"use client";
import React from 'react';
import Link from 'next/link';

const DEFAULT_PALETTE = { bg: "#FFF4E0", text: "#1A1330", muted: "#5B5078", accent: "#A8311A", accentBright: "#FF6B6B", border: "#1A1330" };

const Footer = ({ palette = DEFAULT_PALETTE }) => {
  const currentYear = new Date().getFullYear();
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
          <img src="/logo.png" alt="BullShift Logo" style={{ width: "60px", height: "auto", borderRadius: 12 }} />
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
    </footer>
  );
};

export default Footer;
