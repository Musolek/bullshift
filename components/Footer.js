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
    <footer className="w-full bg-black border-t-2 border-neutral-900 mt-auto select-none">
      {/* Upper Layout Columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Col 1: Identity Card */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs tracking-widest text-neutral-600">// DE-BOTTING FRAMEWORK</span>
          <img src="/logo.png" alt="BullShift Logo" style={{ height: 48, width: "auto" }} />
          <p className="font-sans text-sm text-neutral-400 max-w-sm leading-relaxed">
            Bullshift handles the strategic translation of corporate dialect into raw human utility. No algorithms were rented to produce your copy.
          </p>
        </div>

        {/* Col 2: High-Fidelity Nav Ledgers */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs tracking-widest text-neutral-600">// PROTOCOLS</span>
          <ul className="flex flex-col gap-1.5 font-mono text-xs">
            {links.map((link, i) => (
              <li key={i} className="group flex items-center justify-between border-b border-neutral-950 py-1 max-w-xs hover:border-neutral-900 transition-colors duration-150">
                <Link href={`/${link.label.toLowerCase()}`} className="text-neutral-400 group-hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-cinematic text-accent-crimson">█</span>
                  {link.label}
                </Link>
                <span className="text-neutral-700 font-normal group-hover:text-neutral-500 transition-colors duration-150 text-[10px]">
                  {link.size}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: System Specifications */}
        <div className="flex flex-col gap-3 font-mono text-[11px] text-neutral-500">
          <span className="text-xs tracking-widest text-neutral-600">// CORE MANIFEST</span>
          <div className="space-y-1 bg-panel p-3 border border-neutral-900 shadow-inner">
            <div>ENGINE: BULLSHIFT_CORE_V2.0.26</div>
            <div>INFRASTRUCTURE: OFFLINE_FIRST_CAPABLE</div>
            <div>DATA RETENTION: ZERO_STORAGES_RECORDED</div>
            <div>LOCATION COORD: 35.7796° N, 78.6382° W</div>
          </div>
        </div>
      </div>

      {/* Infinite Hardware-Accelerated Marquee Base */}
      <div className="w-full bg-neutral-950 border-t border-neutral-900 py-2.5 overflow-hidden relative flex items-center">
        <div className="ticker-wrap w-full flex text-[10px] font-mono tracking-[0.2em] text-neutral-600 uppercase">
          <div className="animate-ticker ticker-content flex gap-8 shrink-0">
            <span>• BULLSHIFT CORE SYSTEM LOG ACTIVE</span>
            <span>• OWN YOUR WORDS OVER THE ALGORITHM</span>
            <span>• HUMANITY METRIC LEVEL 100% SECURE</span>
            <span>• NO COOKIES COLLECTED</span>
            <span>• COPYRIGHT {currentYear} ALL RIGHTS RESERVED</span>
          </div>
          {/* Duplicated instance to maintain visual loop consistency */}
          <div className="animate-ticker ticker-content flex gap-8 shrink-0" aria-hidden="true">
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
