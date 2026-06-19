"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TONES = [
  { id: 1, label: "Diplomatic",  desc: "Highly charitable translation layers. Keeps relationships entirely intact." },
  { id: 2, label: "Measured",    desc: "Clear, structural interpretation containing modern professional warmth." },
  { id: 3, label: "Balanced",    desc: "Completely neutral posture. Absolutely zero optimization padding." },
  { id: 4, label: "Blunt",       desc: "Terse, hyper-compact output profiles. Says exactly what it implies." },
  { id: 5, label: "Obliterate",  desc: "Surgical baseline exposure. Withering analytical execution." },
];

const PALETTES = [
  { id: "tan", name: "Tan", bg: "#F5F0E8", text: "#1A1714", muted: "#6B6560", accent: "#F0B429", border: "#1A1714" },
  { id: "purple", name: "Purple", bg: "#3D348B", text: "#F0E2E7", muted: "#B8A8C8", accent: "#F7B801", border: "#F0E2E7" },
  { id: "yellow", name: "Gold", bg: "#F7B801", text: "#1B1F3B", muted: "#4A4A2A", accent: "#F35B04", border: "#1B1F3B" },
  { id: "orange", name: "Orange", bg: "#F35B04", text: "#F0E2E7", muted: "#D4A8A8", accent: "#F7B801", border: "#1B1F3B" },
  { id: "pink", name: "Pink", bg: "#F0E2E7", text: "#1B1F3B", muted: "#6B6560", accent: "#F35B04", border: "#3D348B" },
  { id: "dark", name: "Dark", bg: "#1B1F3B", text: "#F0E2E7", muted: "#B8A8C8", accent: "#F7B801", border: "#F0E2E7" },
];

const syne = { fontFamily: "'Clash Display', Inter, system-ui, sans-serif", fontStyle: "normal" };
const mono = { fontFamily: "'IBM Plex Mono', monospace", fontStyle: "normal" };
const sans = { fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontStyle: "italic", fontWeight: 400 };

// CBRS Archetypes
const ARCHETYPES = [
  { min: 0, max: 20, name: "The Innocent", desc: "You barely encounter corporate speak. Either you work in a very honest place or you're very new here." },
  { min: 21, max: 40, name: "The Observer", desc: "You see the jargon but don't engage. Smart. You're watching from a safe distance." },
  { min: 41, max: 60, name: "The Skeptic", desc: "You know it's nonsense and you call it out. You're the person everyone wants on their team." },
  { min: 61, max: 80, name: "The Translator", desc: "You can speak both languages fluently. Useful, but be careful not to lose your soul." },
  { min: 81, max: 100, name: "The Carrier", desc: "You might be the problem. High receptivity to corporate bullshit detected." },
];

// CBRS Dimension definitions
const DIMENSIONS = [
  { key: "exposure", name: "Exposure Index", desc: "How much high-inflation content you're translating. High = you're swimming in it.", color: "#C0392B" },
  { key: "tolerance", name: "Tolerance Quotient", desc: "How often you accept gentle translations vs. demanding harder ones. High = you're easy on jargon.", color: "#F0B429" },
  { key: "production", name: "Production Risk", desc: "How frequently you use Human→LinkedIn mode. High = you might be generating the problem.", color: "#3B6D11" },
  { key: "clarity", name: "Clarity Seeking", desc: "Whether your translation requests trend toward more honesty over time. High = you're improving.", color: "#185FA5" },
];

function calculateCBRS(history) {
  if (history.length < 5) return null;

  const translations = history.slice(0, 20); // Use last 20 translations max

  // Exposure Index: Average score of translated content (0-25)
  const avgScore = translations.reduce((sum, t) => sum + t.score, 0) / translations.length;
  const exposure = Math.min(25, (avgScore / 100) * 25);

  // Tolerance Quotient: How often you choose gentle tones (0-25)
  const gentleCount = translations.filter(t => t.tone === "Diplomatic" || t.tone === "Measured").length;
  const tolerance = Math.min(25, (gentleCount / translations.length) * 25);

  // Production Risk: How often you use Human→LinkedIn mode (0-25)
  const productionCount = translations.filter(t => t.mode === "human-to-linkedin").length;
  const production = Math.min(25, (productionCount / translations.length) * 25);

  // Clarity Seeking: Are you choosing harsher tones over time? (0-25)
  const firstHalf = translations.slice(0, Math.floor(translations.length / 2));
  const secondHalf = translations.slice(Math.floor(translations.length / 2));
  const firstAvgTone = firstHalf.reduce((sum, t) => sum + t.toneId, 0) / firstHalf.length;
  const secondAvgTone = secondHalf.reduce((sum, t) => sum + t.toneId, 0) / secondHalf.length;
  const clarity = Math.min(25, Math.max(0, (secondAvgTone - firstAvgTone) * 5));

  const composite = Math.round(exposure + tolerance + production + clarity);

  // Find archetype
  const archetype = ARCHETYPES.find(a => composite >= a.min && composite <= a.max) || ARCHETYPES[4];

  return {
    exposure: Math.round(exposure),
    tolerance: Math.round(tolerance),
    production: Math.round(production),
    clarity: Math.round(clarity),
    composite,
    archetype: archetype.name,
    archetypeDesc: archetype.desc,
  };
}

const SCORE_VERDICTS = [
  [0,  9,  "Barely a trace. Suspiciously transparent and direct for public networks."],
  [10, 29, "Low-grade structural jargon. Annoying corporate habits but functionally forgivable."],
  [30, 49, "Moderate padding detected. This author has attended multiple alignment workshops."],
  [50, 69, "High conversational bloat. Significant efforts taken to shield operational reality."],
  [70, 84, "Severe syntax inflation. Authentic information framework has exited the premises."],
  [85, 100,"Terminal buzzword cascade. Pure high-frequency spatial noise. Zero information payload."],
];

const SCORE_BADGES = [
  [0,  29, { label: "Low Density", bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "rgba(16, 185, 129, 0.2)" }],
  [30, 59, { label: "Mid Density",  bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.2)" }],
  [60, 100,{ label: "High Density", bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "rgba(239, 68, 68, 0.2)" }],
];

const EXAMPLES = [
  "Excited to share that I've been on an incredible journey of self-disruption, leveraging my authentic personal brand to ideate at the intersection of purpose and scalability.",
  "We need to circle back and synergize our core competencies to ensure we're moving the needle on our key deliverables while staying agile in this ever-evolving landscape.",
  "Just had a powerful conversation with an incredible human. The energy in the room was palpable. So grateful for this season of growth. More soon. 🚀",
];

const JARGON_WORDS = [
  "SYNERGIZE", "CIRCLE BACK", "ALIGNMENT PROTOCOL", "BOIL THE OCEAN", "TAKE IT OFFLINE",
  "LEVERAGE ASSETS", "PARADIGM SHIFT", "THOUGHT LEADER", "DEEP DIVE MATRIX", "TOUCH BASE"
];

// Re-populated original data structures exactly as presented in the baseline architecture
const ORIGINAL_HISTORY = [
  {
    id: "h-1",
    time: "4 mins ago",
    tone: "Obliterate",
    toneId: 5,
    score: 92,
    mode: "linkedin-to-human",
    original: "We are hyper-focused on executing a cross-functional optimization sweep to anchor our core value pillars.",
    translation: "We are firing several people across mid-tier management to balance this quarter's net expenditure."
  },
  {
    id: "h-2",
    time: "32 mins ago",
    tone: "Diplomatic",
    toneId: 1,
    score: 54,
    mode: "linkedin-to-human",
    original: "Moving forward, let's establish a more robust cadence for out-of-the-box conceptual syncs.",
    translation: "We need to set up more recurrent status updates because deadlines are currently being missed."
  }
];

function getVerdict(score) {
  for (const [lo, hi, txt] of SCORE_VERDICTS) if (score >= lo && score <= hi) return txt;
  return "";
}
function getBadge(score) {
  for (const [lo, hi, b] of SCORE_BADGES) if (score >= lo && score <= hi) return b;
  return SCORE_BADGES[2][2];
}

function UniversalBrandBadge() {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
      {/* Structural trademark vector container — explicit text elements eliminated */}
      <path d="M50 8C26.8 8 8 26.8 8 50C8 73.2 26.8 92 50 92C73.2 92 92 73.2 92 50C92 26.8 73.2 8 50 8ZM50 86C30.1 86 14 69.9 14 50C14 30.1 30.1 14 50 14C69.9 14 86 30.1 86 50C86 69.9 69.9 86 50 86Z" fill="currentColor"/>
      <path d="M35 32C33.3 32 32 33.3 32 35V65C32 66.7 33.3 68 35 68H42C43.7 68 45 66.7 45 65V53H55V65C55 66.7 56.3 68 58 68H65C66.7 68 68 66.7 68 65V35C68 33.3 66.7 32 65 32H58C56.3 32 55 33.3 55 35V45H45V35C45 33.3 43.7 32 42 32H35Z" fill="currentColor"/>
      <path d="M50 20C48.3 20 47 21.3 47 23V27C47 28.7 48.3 30 50 30C51.7 30 53 28.7 53 27V23C53 21.3 51.7 20 50 20Z" fill="currentColor"/>
      <path d="M50 70C48.3 70 47 71.3 47 73V77C47 78.7 48.3 80 50 80C51.7 80 53 78.7 53 77V73C53 71.3 51.7 70 50 70Z" fill="currentColor"/>
    </svg>
  );
}

function CinematicFrame() {
  const videoRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!videoRef.current) return;
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - left) / width - 0.5;
    const yVal = (e.clientY - top) / height - 0.5;
    videoRef.current.style.transform = `scale(1.04) translate(${xVal * -12}px, ${yVal * -12}px) rotateY(${xVal * 6}deg) rotateX(${yVal * -6}deg)`;
  };
  const handleMouseLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.style.transform = "scale(1) translate(0px, 0px) rotateY(0deg) rotateX(0deg)";
  };
  return (
    <div className="video-frame-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <video ref={videoRef} className="video-frame-element" autoPlay loop muted playsInline>
        <source src="/9656450-uhd_4096_2160_25fps.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function SpotlightCard({ original, shifted, note, palette }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      border: "1.5px solid " + palette.border,
      background: "rgba(255,255,255,0.3)",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ padding: 32, borderBottom: "1.5px solid " + palette.border, background: "rgba(255,255,255,0.2)" }}>
        <div style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: palette.muted, marginBottom: 16 }}>Original Transmission // Move cursor over text to scan</div>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: palette.text }}>{original}</p>
      </div>
      <div style={{ padding: 32, background: palette.text }}>
        <div style={{ ...mono, fontSize: 11, color: palette.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Decoded Core Intention</div>
        <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6, color: palette.bg }}>{shifted}</p>
        {note && <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 14, color: palette.muted, fontStyle: "italic" }}>⚡ {note}</div>}
      </div>
    </div>
  );
}

function CBRSShareCard({ cbrs }) {
  return (
    <div id="cbrs-share-card" style={{
      position: "fixed",
      top: "-9999px",
      left: "-9999px",
      width: "600px",
      height: "400px",
      background: "#1A1714",
      padding: "40px",
      borderRadius: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <img src="/logo.png" alt="BullShift" style={{ width: "48px", height: "48px" }} />
        <div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#EDE8DE", letterSpacing: "-0.5px" }}>BullShift</div>
          <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#6B6560", letterSpacing: "0.08em", textTransform: "uppercase" }}>Corporate Bullshit Receptivity Scale</div>
        </div>
      </div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: "48px", fontWeight: 800, color: "#F0B429", lineHeight: 1, marginBottom: "12px" }}>
          {cbrs.archetype}
        </div>
        <div style={{ fontSize: "16px", color: "#A8A39D", lineHeight: 1.5, marginBottom: "24px" }}>
          {cbrs.archetypeDesc}
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: dim.color, lineHeight: 1 }}>{cbrs[dim.key]}</div>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "#6B6560", marginTop: "4px" }}>
                {dim.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: "13px", color: "#6B6560" }}>
          Composite: <span style={{ color: "#EDE8DE", fontWeight: 700 }}>{cbrs.composite}/100</span>
        </div>
        <div style={{ fontSize: "11px", color: "#6B6560", fontFamily: "var(--font-mono)" }}>
          bullshift.app
        </div>
      </div>
    </div>
  );
}

export default function BullShift() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [tone, setTone] = useState(3);
  const [mode, setMode] = useState("linkedin-to-human"); // "linkedin-to-human" or "human-to-linkedin"
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const [history, setHistory] = useState(ORIGINAL_HISTORY);
  const [showCBRS, setShowCBRS] = useState(false);
  const [palette, setPalette] = useState(PALETTES[0]); // Default to tan palette
  const [decodedKey, setDecodedKey] = useState(0);
  const heroRef = useRef(null);
  const heroWasVisible = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (history.length >= 5) {
      setShowCBRS(true);
    }
  }, [history]);

  // Replay the "decoded" strike-through whenever the hero scrolls back into view
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !heroWasVisible.current) {
        heroWasVisible.current = true;
        setDecodedKey(k => k + 1);
      } else if (!entry.isIntersecting) {
        heroWasVisible.current = false;
      }
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const runShift = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setOutput(null);
    const label = TONES[tone - 1].label;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tone: label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Translation failed.");

      const parsedData = {
        translation: data.translation,
        score: data.score,
        note: data.note,
        jargon: data.jargon,
      };
      setOutput(parsedData);
      setHistory(prev => [{
        id: `h-${Date.now()}`,
        time: "Just now",
        tone: label,
        toneId: tone,
        mode: mode,
        score: parsedData.score,
        original: input,
        translation: parsedData.translation
      }, ...prev]);
    } catch (err) {
      setOutput({ translation: err.message || "Translation failed. Please try again.", score: 0, note: "", jargon: [] });
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = async () => {
    if (!output?.translation) return;
    await navigator.clipboard.writeText(output.translation);
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  };

  if (!mounted) return null;
  const scoreVal = output ? Math.max(0, Math.min(100, parseInt(output.score) || 0)) : 0;
  const badge = output ? getBadge(scoreVal) : null;
  const cbrs = calculateCBRS(history);

  return (
    <div style={{ background: palette.bg, minHeight: "100vh", ...sans, color: palette.text }}>
      {cbrs && <CBRSShareCard cbrs={cbrs} />}
      
      <Header isTyping={loading} jargonDensity={scoreVal} palette={palette} setPalette={setPalette} />

      {/* HERO */}
      <div style={{ padding: "48px 20px 0", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ ...mono, fontSize: "10px", letterSpacing: "0.12em", color: palette.accent, textTransform: "uppercase", marginBottom: 14 }}>
          Translation Engine
        </div>
        <h1 ref={heroRef} style={{ ...syne, fontWeight: 800, fontSize: "clamp(32px,6vw,64px)", lineHeight: 0.92, letterSpacing: "-0.04em", color: palette.text, marginBottom: 28 }}>
          LinkedIn jargon<br />
          <span className="strike-wrap" style={{ color: palette.muted }}>
            decoded
            <span key={decodedKey} className="strike-line" style={{ background: palette.accent }} />
          </span><br />
          without <span style={{ color: palette.accent }}>mercy</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: palette.muted, fontWeight: 300, maxWidth: 580, marginBottom: 24 }}>
          Paste any opaque corporate communication down below. We analyze the speech architecture, isolate baseline truths, and strip away tactical filler words.
        </p>

        {/* Fun Stats */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 32, marginBottom: 8 }}>
          <div style={{ ...mono, fontSize: 12, color: palette.muted }}>
            <span style={{ ...syne, fontSize: 24, fontWeight: 800, color: palette.text, display: "block", marginBottom: 4 }}>142K+</span>
            buzzwords autopsied
          </div>
          <div style={{ ...mono, fontSize: 12, color: palette.muted }}>
            <span style={{ ...syne, fontSize: 24, fontWeight: 800, color: palette.text, display: "block", marginBottom: 4 }}>0</span>
            circle-backs tolerated
          </div>
          <div style={{ ...mono, fontSize: 12, color: palette.muted }}>
            <span style={{ ...syne, fontSize: 24, fontWeight: 800, color: palette.text, display: "block", marginBottom: 4 }}>100%</span>
            bullshit-free
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ margin: "32px 0", overflow: "hidden", borderTop: "1.5px solid " + palette.border, borderBottom: "1.5px solid " + palette.border }}>
        <div style={{ display: "flex", gap: 0, whiteSpace: "nowrap", animation: "ticker 28s linear infinite", padding: "12px 0" }}>
          {[...JARGON_WORDS, ...JARGON_WORDS].map((word, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{ ...mono, fontSize: 11, color: palette.muted, padding: "0 16px" }}>{word}</span>
              <span style={{ color: palette.border }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <main id="engine" style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        <div className="workspace-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          {/* Left Input Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
                <label style={{ ...mono, fontSize: 12, textTransform: "uppercase", color: palette.muted }}>Input Matrix</label>
                <button onClick={() => { setInput(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]); setOutput(null); }} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", ...sans, color: palette.text }}>Load random example →</button>
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste corporate communication strings here..." style={{ width: "100%", minHeight: 200, padding: 16, borderRadius: 8, border: "1.5px solid " + palette.border, background: "rgba(255,255,255,0.3)", backdropFilter: "blur(12px)", fontFamily: sans, fontSize: 15, color: palette.text, resize: "vertical" }} />
            </div>

            <div>
              <label style={{ ...mono, fontSize: 12, textTransform: "uppercase", color: palette.muted, display: "block", marginBottom: 16 }}>Translation Mode</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button 
                  onClick={() => setMode("linkedin-to-human")}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: mode === "linkedin-to-human" ? palette.text : "rgba(255,255,255,0.3)",
                    color: mode === "linkedin-to-human" ? palette.bg : palette.text,
                    border: "1.5px solid " + palette.border,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  LinkedIn → Human
                </button>
                <button 
                  onClick={() => setMode("human-to-linkedin")}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: mode === "human-to-linkedin" ? palette.text : "rgba(255,255,255,0.3)",
                    color: mode === "human-to-linkedin" ? palette.bg : palette.text,
                    border: "1.5px solid " + palette.border,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Human → LinkedIn
                </button>
              </div>
            </div>

            <div>
              <label style={{ ...mono, fontSize: 12, textTransform: "uppercase", color: palette.muted, display: "block", marginBottom: 16 }}>Severity Profile Settings</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TONES.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setTone(t.id)}
                    style={{
                      padding: "8px 16px",
                      background: tone === t.id ? palette.text : "rgba(255,255,255,0.3)",
                      color: tone === t.id ? palette.bg : palette.text,
                      border: "1.5px solid " + palette.border,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: palette.muted, fontStyle: "italic" }}>↳ Posture: {TONES[tone - 1].desc}</div>
            </div>

            <button 
              onClick={runShift} 
              disabled={loading || !input.trim()}
              style={{
                padding: "14px 24px",
                background: loading || !input.trim() ? palette.border : palette.text,
                color: loading || !input.trim() ? palette.muted : palette.bg,
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                ...mono,
                transition: "all 0.2s"
              }}
            >
              {loading ? "Processing..." : mode === "linkedin-to-human" ? "Deconstruct Targets" : "Generate Corporate Speak"}
            </button>
          </div>

          {/* Right Output Panel */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ ...mono, fontSize: 12, textTransform: "uppercase", color: palette.muted, marginBottom: 14, display: "block" }}>Output Spectrum Matrix</label>
            
            {output && !loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>
                <SpotlightCard original={input} shifted={output.translation} note={output.note} palette={palette} />
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 32, background: "rgba(255,255,255,0.3)", backdropFilter: "blur(12px)", borderRadius: 16, border: "1.5px solid " + palette.border }}>
                  <div>
                    <div style={{ ...mono, fontSize: 11, color: palette.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                      Jargon Density Index
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ fontSize: 48, ...syne, fontWeight: 800, lineHeight: 1 }}>{scoreVal}<span style={{ fontSize: 18, color: palette.muted, ...sans, fontWeight: 400 }}>/100</span></span>
                      <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: "6px 14px", borderRadius: 8, fontSize: 12, ...mono, fontWeight: 500 }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 14, color: palette.muted, fontWeight: 500, lineHeight: 1.4 }}>
                      {getVerdict(scoreVal)}
                    </div>
                  </div>
                  <button 
                    onClick={copyOutput}
                    style={{ 
                      padding: "14px 24px", 
                      background: palette.text, 
                      border: "1.5px solid " + palette.border, 
                      borderRadius: 6, 
                      color: palette.bg, 
                      ...mono, 
                      fontSize: 13, 
                      cursor: "pointer", 
                      transition: "all 0.2s" 
                    }}
                  >
                    {copyState === "copied" ? "COPIED //" : "COPY OUTPUT"}
                  </button>
                </div>

                {output.jargon?.length > 0 && (
                  <div>
                    <div style={{ ...mono, fontSize: 11, color: palette.muted, textTransform: "uppercase", marginBottom: 16 }}>Purged Linguistic Inflations</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {output.jargon.map((j, i) => (
                        <span key={i} style={{ padding: "8px 16px", background: "rgba(192, 57, 43, 0.1)", color: "#C0392B", borderRadius: 8, fontSize: 13, ...mono, border: "1px solid rgba(192, 57, 43, 0.2)", textDecoration: "line-through" }}>
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div style={{ flex: 1, borderRadius: 16, border: "1.5px dashed " + palette.border, display: "flex", flexDirection: "column", padding: 48, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
                {loading ? (
                  <div style={{ margin: "auto", textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid " + palette.border, borderTopColor: palette.accent, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
                    <p style={{ fontSize: 14, ...mono, color: palette.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Analyzing Speech Matrix...</p>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontSize: 14, ...mono, textTransform: "uppercase", letterSpacing: "0.15em", color: palette.text, marginBottom: 32 }}>Engine Diagnostics Protocol</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                      {[
                        ["01 /", "Isolate Context Layer", "Drop messy organizational copy, performance alignment reports, or abstract LinkedIn communications into the frame."],
                        ["02 /", "Calibrate Friction Level", "Toggle through our scaling system. Move from nice translation profiles directly up into high-intensity logical reductions."],
                        ["03 /", "Deconstruct Speak Elements", "Extract plain text representations immediately. Isolate dense structural bloat with full numerical score data."]
                      ].map(([step, title, desc], i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 16 }}>
                          <span style={{ ...mono, color: palette.accent, fontSize: 14, fontWeight: 500 }}>{step}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, letterSpacing: "-0.01em" }}>{title}</div>
                            <div style={{ color: palette.muted, fontSize: 14, lineHeight: 1.5 }}>{desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Red Thread: Dimension Explanations */}
      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ ...mono, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: palette.accent, marginBottom: 20 }}>
          Corporate Bullshit Receptivity Scale — Four Dimensions
        </div>
        <div className="dimensions-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} style={{ borderTop: `3px solid ${dim.color}`, paddingTop: 16 }}>
              <div style={{ ...mono, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: palette.muted, marginBottom: 8 }}>
                {dim.name}
              </div>
              <div style={{ fontSize: 13, color: palette.text, lineHeight: 1.5, fontWeight: 500 }}>
                {dim.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BULLPEN */}
      <section id="bullpen" style={{ maxWidth: "1400px", margin: "0 auto", padding: "48px 20px" }}>
        <div className="flex-row-mobile" style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div>
            <h2 style={{ ...syne, fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>The Bullpen</h2>
            <p style={{ fontSize: 13, color: palette.muted }}>Linguistic ledger tracking audited pipeline corporate updates</p>
          </div>
          {history.length > 0 && <button onClick={() => setHistory([])} style={{ background: "none", border: "none", ...mono, fontSize: 11, color: "#C0392B", cursor: "pointer", fontWeight: 600, padding: 12, minWidth: 44, minHeight: 44 }}>Purge Records [×]</button>}
        </div>

        {/* CBRS Diagnostic - Shows after 5 translations */}
        {showCBRS && cbrs && (
          <div style={{ marginBottom: 32, padding: 24, background: "rgba(255,255,255,0.3)", backdropFilter: "blur(12px)", borderRadius: 16, border: "1.5px solid " + palette.border }}>
            <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: palette.accent, marginBottom: 8 }}>
                Corporate Bullshit Receptivity Scale
              </div>
              <div style={{ fontSize: 28, ...syne, fontWeight: 800, color: palette.text, lineHeight: 1, marginBottom: 8 }}>
                {cbrs.archetype}
              </div>
              <div style={{ fontSize: 14, color: palette.muted, lineHeight: 1.5 }}>
                {cbrs.archetypeDesc}
              </div>
            </div>

            <div className="cbrs-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              {DIMENSIONS.map((dim) => (
                <div key={dim.key} style={{ padding: 16, background: "rgba(255,255,255,0.3)", borderRadius: 8 }}>
                  <div style={{ fontSize: 28, ...syne, fontWeight: 800, color: dim.color, lineHeight: 1, marginBottom: 4 }}>
                    {cbrs[dim.key]}
                  </div>
                  <div style={{ ...mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: palette.muted, marginBottom: 6 }}>
                    {dim.name}
                  </div>
                  <div style={{ fontSize: 11, color: palette.muted, lineHeight: 1.4 }}>
                    {dim.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-row-mobile" style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 13, color: palette.muted }}>
                Composite Score: <span style={{ color: palette.text, fontWeight: 700 }}>{cbrs.composite}/100</span>
              </div>
              <button 
                onClick={() => {
                  const text = `I took the BullShift Corporate Bullshit Receptivity Test and scored ${cbrs.composite}/100. I'm a ${cbrs.archetype}. ${cbrs.archetypeDesc}`;
                  navigator.clipboard.writeText(text);
                  alert('Archetype copied to clipboard! Share it on LinkedIn for maximum irony.');
                }}
                style={{ padding: "12px 20px", background: palette.accent, color: palette.text, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", ...mono, minWidth: 44, minHeight: 44 }}
              >
                Share Archetype
              </button>
            </div>
          </div>
        )}

        {/* History Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, border: "1.5px solid " + palette.border, borderRadius: 8, overflow: "hidden" }}>
          {history.map((item) => (
            <div key={item.id} className="history-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, padding: 20, borderBottom: "1.5px solid " + palette.border, ...(item === history[history.length - 1] ? { borderBottom: "none" } : {}) }}>
              <div>
                <div style={{ fontSize: 12, color: palette.muted }}>{item.time}</div>
                <div style={{ color: palette.text, fontWeight: 700, marginTop: 2, fontSize: 13 }}>{item.tone}</div>
              </div>
              <div style={{ fontSize: 14, color: palette.muted, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.original}</div>
              <div style={{ fontSize: 14, color: palette.text, fontWeight: 500, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.translation}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
                <span style={{ ...mono, fontSize: 12, fontWeight: 700, background: getBadge(item.score).bg, color: getBadge(item.score).color, padding: "4px 10px", borderRadius: 6 }}>{item.score} IDX</span>
                <button onClick={() => { setInput(item.original); setOutput(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 14, padding: 12, minWidth: 44, minHeight: 44 }}>↺</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 767px) {
          .nav-link { display: none !important; }
          .workspace-grid { grid-template-columns: 1fr !important; }
          .dimensions-grid { grid-template-columns: 1fr !important; }
          .cbrs-grid { grid-template-columns: 1fr !important; }
          .history-row { grid-template-columns: 1fr !important; }
          .flex-row-mobile { flex-direction: column !important; }
        }
        
        @media (min-width: 768px) {
          .nav-link { display: block !important; }
          .workspace-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .dimensions-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 24px !important; }
          .cbrs-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .history-row { grid-template-columns: 100px 1fr 1fr 120px !important; gap: 0 !important; }
          .flex-row-mobile { flex-direction: row !important; }
        }
      `}</style>
    </div>
  );
}
