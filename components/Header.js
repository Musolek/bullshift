"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const LINKS = [
  ["#how", "How it works"],
  ["#levels", "Five levels"],
  ["#bullpen", "The Bullpen"],
  ["#faq", "FAQ"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(false);
    const rs = () => window.innerWidth > 820 && setOpen(false);
    window.addEventListener("keydown", esc);
    window.addEventListener("resize", rs);
    return () => { window.removeEventListener("keydown", esc); window.removeEventListener("resize", rs); };
  }, []);
  return (
    <header className={"nav" + (open ? " open" : "")} id="nav">
      <div className="nav-in">
        <Link className="logo" href="/">
          <img src="/logo.png" alt="BullShift logo" width="28" height="28" />
          <b>BullShift</b>
        </Link>
        <nav id="navMenu" aria-label="Primary">
          {LINKS.map(([h, t]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>
          ))}
        </nav>
        <span className="free">Free. No sign-up.</span>
        <button type="button" className="burger" aria-expanded={open} aria-controls="navMenu" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}
