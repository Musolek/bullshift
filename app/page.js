"use client";
import { useState, useEffect, useRef } from "react";

const TONES = [
  { id: 1, label: "Diplomatic",  desc: "Highly charitable translation layers. Keeps relationships entirely intact." },
  { id: 2, label: "Measured",    desc: "Clear, structural interpretation containing modern professional warmth." },
  { id: 3, label: "Balanced",    desc: "Completely neutral posture. Absolutely zero optimization padding." },
  { id: 4, label: "Blunt",       desc: "Terse, hyper-compact output profiles. Says exactly what it implies." },
  { id: 5, label: "Obliterate",  desc: "Surgical baseline exposure. Withering analytical execution." },
];

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
  [0,  29, { label: "Low Density", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" }],
  [30, 59, { label: "Mid Density",  bg: "#fffbeb", color: "#d97706", border: "#fde68a" }],
  [60, 100,{ label: "High Density", bg: "#fef2f2", color: "#dc2626", border: "#fecaca" }],
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

function SpotlightCard({ original, shifted, note }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="spotlight-wrapper" style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` }}>
      <div className="spotlight-base">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Original Transmission // Move cursor over text to scan</div>
        <p style={{ fontSize: "16px", lineHeight: 1.7 }}>{original}</p>
      </div>
      <div className="spotlight-reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Decoded Core Intention</div>
        <p style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.6 }}>{shifted}</p>
        {note && <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)", fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic" }}>✨ {note}</div>}
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

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (history.length >= 5) {
      setShowCBRS(true);
    }
  }, [history]);

  const runShift = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setOutput(null);
    const label = TONES[tone - 1].label;

    setTimeout(() => {
      const parsedData = {
        translation: mode === "linkedin-to-human" 
          ? "I am intentionally inflating minor administrative updates to protect my current operational overhead budget."
          : "We need to leverage our core competencies to drive synergistic outcomes across the value chain.",
        score: mode === "linkedin-to-human" ? 78 : 65,
        note: mode === "linkedin-to-human" ? "Heavy linguistic deflection detected. Normalization routine complete." : "Corporate speak successfully synthesized.",
        jargon: ["CROSS-FUNCTIONAL SWEEP", "CORE VALUE PILLARS", "OPTIMIZATION FRAMEWORKS"]
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
      setLoading(false);
    }, 1200);
  };

  if (!mounted) return null;
  const scoreVal = output ? Math.max(0, Math.min(100, parseInt(output.score) || 0)) : 0;
  const badge = output ? getBadge(scoreVal) : null;
  const cbrs = calculateCBRS(history);

  return (
    <>
      <CBRSShareCard cbrs={cbrs} />
      <header className="premium-header">
        <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
          Bull<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>Shift</span>
        </div>
        <nav style={{ display: "flex", gap: "32px", fontFamily: "var(--font-mono)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <a href="#engine" style={{ color: "var(--text-main)", textDecoration: "none" }}>Engine Sandbox</a>
          <a href="#bullpen" style={{ color: "var(--text-muted)", textDecoration: "none" }}>The Bullpen</a>
        </nav>
      </header>

      <section className="hero-editorial-grid">
        <CinematicFrame />
        <div>
          <div className="hero-tagline"><span>✦</span> System Sandbox v2.4 Online</div>
          <h1 className="hero-main-title">LinkedIn jargon decoded, <br /><span style={{ fontWeight: 400, fontStyle: "italic", color: "var(--text-muted)" }}>no mercy.</span></h1>
          <p className="hero-description">Paste a post down below. We strip away the corporate buzzwords, evaluate linguistic transparency metrics, and translate the true meaning instantly.</p>
          <a href="#engine" className="btn-primary-studio pulse-glow" style={{ textDecoration: "none", display: "inline-flex", maxWidth: "240px" }}>Initialize Workbench</a>
        </div>
      </section>

      {/* ── RESTORED: Original Analytical Core Stats Row ── */}
      <section className="stats-banner-container scroll-reveal">
        <div className="stats-banner-inner">
          <div className="stat-card stagger-1"><div className="stat-card-title">Buzzwords Flagged</div><div className="stat-card-value">142,804</div></div>
          <div className="stat-card stagger-2"><div className="stat-card-title">System Precision</div><div className="stat-card-value">99.84%</div></div>
          <div className="stat-card stagger-3"><div className="stat-card-title">Instance Postures</div><div className="stat-card-value">Active</div></div>
          <div className="stat-card stagger-4"><div className="stat-card-title">Processing Velocity</div><div className="stat-card-value">14ms</div></div>
        </div>
      </section>

      <div style={{ height: "40px" }} />

      <div className="marquee-ribbon">
        <div className="marquee-track">
          {[...JARGON_WORDS, ...JARGON_WORDS, ...JARGON_WORDS].map((word, i) => (
            <span key={i} className="marquee-item">{word} •</span>
          ))}
        </div>
      </div>

      {/* Red Thread: Dimension Explanations */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "48px 64px" }} className="scroll-reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "20px" }}>
          Corporate Bullshit Receptivity Scale — Four Dimensions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} style={{ borderTop: `3px solid ${dim.color}`, paddingTop: "16px" }}>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "8px" }}>
                {dim.name}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-main)", lineHeight: 1.5, fontWeight: 500 }}>
                {dim.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <main id="engine" className="workspace-section scroll-reveal">
        <div className="studio-panel-grid stagger-1">
          
          {/* Left Input Box */}
          <div className="interactive-panel">
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", alignItems: "center" }}>
                <label style={{ fontSize: "12px", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--text-muted)" }}>Input Matrix</label>
                <button onClick={() => { setInput(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]); setOutput(null); }} style={{ background: "none", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", color: "var(--text-main)" }}>Load random example →</button>
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste corporate communication strings here..." className="studio-textarea" />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "16px" }}>Translation Mode</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button 
                  onClick={() => setMode("linkedin-to-human")}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: mode === "linkedin-to-human" ? "var(--text-main)" : "var(--bg-color)",
                    color: mode === "linkedin-to-human" ? "var(--surface)" : "var(--text-muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "13px",
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
                    background: mode === "human-to-linkedin" ? "var(--text-main)" : "var(--bg-color)",
                    color: mode === "human-to-linkedin" ? "var(--surface)" : "var(--text-muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "13px",
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
              <label style={{ fontSize: "12px", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "16px" }}>Severity Profile Settings</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TONES.map(t => (
                  <button key={t.id} onClick={() => setTone(t.id)} className={`tone-selector-pill ${tone === t.id ? "selected" : ""}`}>{t.label}</button>
                ))}
              </div>
              <div style={{ marginTop: "14px", fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic" }}>↳ Posture: {TONES[tone - 1].desc}</div>
            </div>

            <button onClick={runShift} disabled={loading || !input.trim()} className="btn-primary-studio">
              {loading ? <div className="spinner" /> : mode === "linkedin-to-human" ? "Deconstruct Targets" : "Generate Corporate Speak"}
            </button>
          </div>

          {/* Right Sandbox Container */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "12px", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "14px", display: "block" }}>Output Spectrum Matrix</label>
            
            {output && !loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>
                <SpotlightCard original={input} shifted={output.translation} note={output.note} />
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px", background: "var(--surface)", borderRadius: "20px", border: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Linguistic Inflation Score</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                      <span style={{ fontSize: "40px", fontWeight: 800, tracking: "-1px" }}>{scoreVal}<span style={{ fontSize: "16px", color: "var(--text-muted)", fontWeight: 400 }}>/100</span></span>
                      <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>{badge.label}</span>
                    </div>
                    <div style={{ marginTop: "10px", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.4 }}>{getVerdict(scoreVal)}</div>
                  </div>
                  <button onClick={async () => { await navigator.clipboard.writeText(output.translation); setCopyState("copied"); setTimeout(() => setCopyState("idle"), 2000); }} style={{ padding: "12px 20px", background: "var(--bg-color)", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    {copyState === "copied" ? "Copied ✓" : "Copy Output"}
                  </button>
                </div>

                {output.jargon?.length > 0 && (
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>Flagged Structural Breaches</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {output.jargon.map((j, i) => (
                        <span key={i} style={{ padding: "6px 14px", background: "#fef2f2", color: "#dc2626", borderRadius: "8px", fontSize: "13px", fontWeight: 500, border: "1px solid #fee2e2", textDecoration: "line-through", fontFamily: "var(--font-mono)" }}>{j}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, borderRadius: "24px", border: "1px dashed var(--border)", display: "flex", flexDirection: "column", padding: "40px", background: "var(--surface)" }}>
                {loading ? (
                  <div style={{ margin: "auto", textAlign: "center" }}>
                    <div className="spinner spinner-dark" style={{ width: "32px", height: "32px", margin: "0 auto 16px" }} />
                    <p style={{ fontSize: "14px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase" }}>Deconstructing corporate assets...</p>
                  </div>
                ) : (
                  <>
                    {/* ── RESTORED: Exact Original Instructional Stepper Labels ── */}
                    <h3 style={{ fontSize: "14px", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--text-main)", marginBottom: "32px" }}>Core Execution Architecture</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                      {[
                        ["01 /", "Isolate Target Context", "Input the targeted corporate communication or timeline profile into the processing terminal window."],
                        ["02 /", "Calibrate Posture Curve", "Adjust output constraints from diplomatic correction sweeps up to raw mechanical transparency paths."],
                        ["03 /", "Extract Value Realization", "Execute full textual deconstruction loops, cataloging linguistic density vectors and core meanings."]
                      ].map(([num, title, desc], i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "12px" }}>
                          <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "13px" }}>{num}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{title}</div>
                            <div style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.5 }}>{desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── RESTORED: Fully Operational Bullpen History Board ── */}
          <section id="bullpen" className="bullpen-container">
            <div className="bullpen-header">
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "4px" }}>The Bullpen</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Linguistic ledger tracking audited pipeline corporate updates</p>
              </div>
              {history.length > 0 && <button onClick={() => setHistory([])} style={{ background: "none", border: "none", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>Purge Records [×]</button>}
            </div>

            {/* CBRS Diagnostic - Shows after 5 translations */}
            {showCBRS && cbrs && (
              <div style={{ marginBottom: "32px", padding: "32px", background: "rgba(28, 26, 23, 0.95)", borderRadius: "16px", border: "1.5px solid #1A1714" }}>
                <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#F0B429", marginBottom: "8px" }}>
                    Corporate Bullshit Receptivity Scale
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#EDE8DE", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                    {cbrs.archetype}
                  </div>
                  <div style={{ fontSize: "14px", color: "#A8A39D", lineHeight: 1.5 }}>
                    {cbrs.archetypeDesc}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  {DIMENSIONS.map((dim) => (
                    <div key={dim.key} style={{ padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: dim.color, lineHeight: 1, marginBottom: "4px" }}>
                        {cbrs[dim.key]}
                      </div>
                      <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B6560", marginBottom: "6px" }}>
                        {dim.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#A8A39D", lineHeight: 1.4 }}>
                        {dim.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", color: "#6B6560" }}>
                    Composite Score: <span style={{ color: "#EDE8DE", fontWeight: 700 }}>{cbrs.composite}/100</span>
                  </div>
                  <button 
                    onClick={() => {
                      const card = document.getElementById('cbrs-share-card');
                      if (card) {
                        const text = `I took the BullShift Corporate Bullshit Receptivity Test and scored ${cbrs.composite}/100. I'm a ${cbrs.archetype}. ${cbrs.archetypeDesc}`;
                        navigator.clipboard.writeText(text);
                        alert('Archetype copied to clipboard! Share it on LinkedIn for maximum irony.');
                      }
                    }}
                    style={{ padding: "10px 20px", background: "#F0B429", color: "#1A1714", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-mono)" }}
                  >
                    Share Archetype
                  </button>
                </div>
              </div>
            )}

            <div className="bullpen-grid">
              {history.map((item) => (
                <div key={item.id} className="bullpen-row">
                  <div className="bullpen-meta">
                    <div>{item.time}</div>
                    <div style={{ color: "var(--text-main)", fontWeight: 700, marginTop: "2px" }}>{item.tone}</div>
                  </div>
                  <div className="bullpen-text-preview" title={item.original}>{item.original}</div>
                  <div className="bullpen-translation-preview" title={item.translation}>{item.translation}</div>
                  <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 700, background: getBadge(item.score).bg, color: getBadge(item.score).color, padding: "4px 10px", borderRadius: "6px" }}>{item.score} IDX</span>
                    <button onClick={() => { setInput(item.original); setOutput(null); window.scrollTo({ top: document.getElementById('engine').offsetTop - 100, behavior: 'smooth' }); }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "14px" }} title="Reload into input workbench">↺</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "80px 64px 60px 64px", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
          <img src="/logo.png" alt="BullShift Logo" style={{ width: "64px", height: "64px", opacity: 0.9 }} />
          <div style={{ display: "flex", gap: "32px", fontSize: "14px", fontWeight: 500 }}>
            <a href="/about" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="var(--text-muted)"}>About</a>
            <a href="/faq" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="var(--text-muted)"}>FAQ</a>
            <a href="/privacy" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="var(--text-muted)"}>Privacy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
