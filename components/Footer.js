"use client";
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'About', size: '2.4kb' },
    { label: 'FAQ', size: '14.1kb' },
    { label: 'Privacy', size: '0.8kb' },
  ];

  return (
    <footer style={{ width: "100%", backgroundColor: "#000000", borderTop: "2px solid #262626", marginTop: "auto", userSelect: "none" }}>
      {/* Upper Layout Columns */}
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem 3rem", display: "grid", gridTemplateColumns: "repeat(1, minmax(0, 1fr))", gap: "2rem" }} className="md:grid-cols-3">
        
        {/* Col 1: Identity Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#525252" }}>// DE-BOTTING FRAMEWORK</span>
          <img src="/logo.png" alt="BullShift Logo" style={{ height: 48, width: "auto" }} />
          <p style={{ fontFamily: "sans-serif", fontSize: "0.875rem", color: "#737373", maxWidth: "20rem", lineHeight: "1.625" }}>
            Bullshift handles the strategic translation of corporate dialect into raw human utility. No algorithms were rented to produce your copy.
          </p>
        </div>

        {/* Col 2: High-Fidelity Nav Ledgers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#525252" }}>// PROTOCOLS</span>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem", fontFamily: "monospace", fontSize: "0.75rem", listStyle: "none", margin: 0, padding: 0 }}>
            {links.map((link, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #171717", paddingTop: "0.25rem", paddingBottom: "0.25rem", maxWidth: "20rem", transition: "borderColor 0.15s" }} className="hover:border-neutral-900">
                <Link href={`/${link.label.toLowerCase()}`} style={{ color: "#737373", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }} className="hover:text-white">
                  <span style={{ opacity: 0, transition: "opacity 0.15s", color: "#ff1e43" }} className="hover:opacity-100">█</span>
                  {link.label}
                </Link>
                <span style={{ color: "#404040", fontSize: "0.625rem", transition: "color 0.15s" }} className="hover:text-neutral-500">
                  {link.size}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: System Specifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontFamily: "monospace", fontSize: "0.6875rem", color: "#737373" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#525252" }}>// CORE MANIFEST</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", backgroundColor: "#0a0a0a", padding: "0.75rem", border: "1px solid #262626", boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)" }}>
            <div>ENGINE: BULLSHIFT_CORE_V2.0.26</div>
            <div>INFRASTRUCTURE: OFFLINE_FIRST_CAPABLE</div>
            <div>DATA RETENTION: ZERO_STORAGES_RECORDED</div>
            <div>LOCATION COORD: 35.7796° N, 78.6382° W</div>
          </div>
        </div>
      </div>

      {/* Infinite Hardware-Accelerated Marquee Base */}
      <div style={{ width: "100%", backgroundColor: "#0a0a0a", borderTop: "1px solid #262626", padding: "0.625rem 0", overflow: "hidden", position: "relative", display: "flex", alignItems: "center" }}>
        <div className="ticker-wrap" style={{ width: "100%", display: "flex", fontSize: "0.625rem", fontFamily: "monospace", letterSpacing: "0.2em", color: "#525252", textTransform: "uppercase" }}>
          <div className="animate-ticker ticker-content" style={{ display: "inline-flex", gap: "2rem", flexShrink: 0, paddingRight: "2rem" }}>
            <span>• BULLSHIFT CORE SYSTEM LOG ACTIVE</span>
            <span>• OWN YOUR WORDS OVER THE ALGORITHM</span>
            <span>• HUMANITY METRIC LEVEL 100% SECURE</span>
            <span>• NO COOKIES COLLECTED</span>
            <span>• COPYRIGHT {currentYear} ALL RIGHTS RESERVED</span>
          </div>
          {/* Duplicated instance to maintain visual loop consistency */}
          <div className="animate-ticker ticker-content" style={{ display: "inline-flex", gap: "2rem", flexShrink: 0, paddingRight: "2rem" }} aria-hidden="true">
            <span>• BULLSHIFT CORE SYSTEM LOG ACTIVE</span>
            <span>• OWN YOUR WORDS OVER THE ALGORITHM</span>
            <span>• HUMANITY METRIC LEVEL 100% SECURE</span>
            <span>• NO COOKIES COLLECTED</span>
            <span>• COPYRIGHT {currentYear} ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
