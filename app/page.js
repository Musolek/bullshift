"use client";
import { useState, useEffect, useRef } from "react";

const TONES = [
  { id: 1, label: "Diplomatic",  desc: "Polite correction. Keeps the peace." },
  { id: 2, label: "Measured",    desc: "Clear translation. Professional posture." },
  { id: 3, label: "Balanced",    desc: "Direct and crisp. Pure substance." },
  { id: 4, label: "Blunt",       desc: "Terse reality. Says exactly what happened." },
  { id: 5, label: "Obliterate",  desc: "Surgical takedown. Zero room to hide." },
];

const SCORE_VERDICTS = [
  [0,  9,  "Suspiciously transparent. Did an actual human write this?"],
  [10, 29, "Mild corporate polish. Tolerable in casual standups."],
  [30, 49, "Standard management speak. Attended too many alignment sessions."],
  [50, 69, "Elevated toxicity. Heavy reliance on shifting narratives."],
  [70, 84, "Severe buzzword inflation. Clear logic has vanished completely."],
  [85, 100,"Terminal buzzword cascade. Pure vibration, absolute zero information."],
];

const SCORE_BADGES = [
  [0,  29, { label: "Clean Spec",   bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "rgba(16, 185, 129, 0.2)" }],
  [30, 59, { label: "Corporate",  bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.2)" }],
  [60, 100,{ label: "Toxic Vibe", bg: "rgba(239, 68, 68, 0.1)",  color: "#ef4444", border: "rgba(239, 68, 68, 0.2)" }],
];

const EXAMPLES = [
  "Excited to share that I've been leveraging my personal brand equity to ideate real-time disruptive strategies at the intersection of purpose and scalable market-fit solutions.",
  "We need to step back, circle baseline alignment with our internal stakeholder matrix, and drive synergy metrics across our core delivery verticals to unlock scale.",
  "Incredibly humbled to connect deeply with cross-functional thought leaders during this meaningful season of intentional platform iteration and self-actualized growth. More soon. 🚀",
];

const JARGON_WORDS = [
  "SYNERGIZE", "CIRCLE BACK", "ALIGNMENT", "BOIL THE OCEAN", "TAKE IT OFFLINE",
  "LEVERAGE", "PIVOT", "MOVE THE NEEDLE", "THOUGHT LEADER", "PARADIGM SHIFT",
  "DEEP DIVE", "TOUCH BASE", "WHEELHOUSE", "DISRUPT", "MOVE FAST"
];

function getVerdict(score) {
  for (const [lo, hi, txt] of SCORE_VERDICTS) if (score >= lo && score <= hi) return txt;
  return "";
}
function getBadge(score) {
  for (const [lo, hi, b] of SCORE_BADGES) if (score >= lo && score <= hi) return b;
  return SCORE_BADGES[2][2];
}

function InfiniteMarquee() {
  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {[...JARGON_WORDS, ...JARGON_WORDS, ...JARGON_WORDS].map((word, i) => (
          <span key={i} className="marquee-item">{word} //</span>
        ))}
      </div>
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="spotlight-wrapper"
      style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` }}
    >
      <div className="spotlight-base">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px", color: "var(--text-muted)" }}>
          Original Sentence // Hover to decode
        </div>
        <p style={{ fontSize: "18px", lineHeight: 1.7, fontWeight: 400 }}>{original}</p>
      </div>
      <div className="spotlight-reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--primary)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
          Decoded Translation
        </div>
        <p style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.6, letterSpacing: "-0.02em" }}>{shifted}</p>
        {note && (
          <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid var(--border)", fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic", display: "flex", gap: "8px" }}>
            <span>⚡</span> <span>{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BullShift() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [tone, setTone] = useState(3);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copyState, setCopyState] = useState("idle");

  useEffect(() => setMounted(true), []);

  const loadExample = () => {
    const pool = EXAMPLES.filter(e => e !== input);
    setInput(pool[Math.floor(Math.random() * pool.length)]);
    setOutput(null);
  };

  const runShift = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tone: TONES[tone - 1].label }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data);
    } catch {
      // Mocked response logic fallback if API endpoint is configuring
      setTimeout(() => {
        setOutput({
          translation: "I am trying to make basic business tasks sound like historical milestones to get attention.",
          score: 78,
          note: "The text was overwritten to preserve human communication clarity.",
          jargon: ["LEVERAGE BRAND EQUITY", "IDEATE", "DISRUPTIVE STRATEGIES"]
        });
        setLoading(false);
      }, 1000);
      return;
    }
    setLoading(false);
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

  return (
    <>
      {/* ── Fixed Premium Navigation ── */}
      <header className="premium-header">
        <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, letterSpacing: "-1px" }}>
          BULL<span style={{ color: "var(--primary)" }}>SHIFT</span>
        </div>
        <nav style={{ display: "flex", gap: "32px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <a href="#tool" style={{ color: "var(--text-main)", textDecoration: "none" }}>Engine</a>
          <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Sandbox API</a>
        </nav>
      </header>

      {/* ── Cinematic Split Hero Area ── */}
      <section className="hero-split-container">
        <div className="hero-video-side">
          {/* Loops the high-contrast retro stock asset directly */}
          <video className="hero-video-element" autoPlay loop muted playsInline>
            <source src="/9656450-uhd_4096_2160_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="hero-text-side">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#111115", border: "1px solid var(--border)", padding: "8px 16px", borderRadius: "30px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--primary)", marginBottom: "32px", width: "fit-content" }}>
            <span>●</span> ENGINE PRODUCTION V2.0
          </div>
          <h1 className="hero-display-title text-gradient-primary">
            Corporate jargon <br />
            <span style={{ color: "var(--primary)" }}>decoded without</span> <br />
            remorse.
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "520px", marginBottom: "40px" }}>
            Drop any opaque corporate communication down below. We analyze the speech architecture, isolate baseline truths, and strip away tactical filler words.
          </p>
          <a href="#tool" className="btn-action" style={{ textDecoration: "none", display: "inline-flex", justifyContent: "center", maxWidth: "240px" }}>
            Initialize Engine
          </a>
        </div>
      </section>

      <InfiniteMarquee />

      {/* ── Core Processing Application Grid ── */}
      <main id="tool" className="main-dashboard-grid reveal-on-scroll">
        
        {/* Input Workstation Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
              <label style={{ fontSize: "13px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Raw Corporate Output</label>
              <button onClick={loadExample} style={{ background: "none", border: "none", fontSize: "13px", color: "var(--primary)", cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                // Insert Sample Spec
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste a LinkedIn update, performance feedback document, or ambiguous executive strategy brief here..."
              className="premium-textarea"
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", display: "block", marginBottom: "16px" }}>Select Severity Scale</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`tone-pill ${tone === t.id ? "active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "16px", fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic" }}>
              ↳ Matrix setting: {TONES[tone - 1].desc}
            </div>
          </div>

          <button
            onClick={runShift}
            disabled={loading || !input.trim()}
            className="btn-action"
            style={{ background: loading || !input.trim() ? "#16161c" : undefined, color: loading || !input.trim() ? "#3e3e4f" : "#fff", border: loading || !input.trim() ? "1px solid var(--border)" : undefined, cursor: loading || !input.trim() ? "not-allowed" : "pointer" }}
          >
            {loading ? <div className="spinner" style={{ margin: "0 auto" }} /> : "Execute Translation Sequence"}
          </button>
        </div>

        {/* Translation Results Workbench */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "13px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "16px", display: "block" }}>System Translation Terminal</label>
          
          {output && !loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", height: "100%" }}>
              <SpotlightCard original={input} shifted={output.translation} note={output.note} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px", background: "#111115", borderRadius: "20px", border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                    Jargon Density Index
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "48px", fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}>{scoreVal}<span style={{fontSize:"18px", color:"var(--text-muted)", fontFamily:"var(--font-sans)", fontWeight:400}}>/100</span></span>
                    <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ marginTop: "14px", fontSize: "14px", color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.4 }}>
                    {getVerdict(scoreVal)}
                  </div>
                </div>
                <button onClick={copyOutput} style={{ padding: "14px 24px", background: "#16161c", border: "1px solid var(--border)", borderRadius: "10px", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e=>e.target.style.borderColor="rgba(255,255,255,0.2)"} onMouseLeave={e=>e.target.style.borderColor="var(--border)"}>
                  {copyState === "copied" ? "COPIED //" : "COPY OUTPUT"}
                </button>
              </div>

              {output.jargon?.length > 0 && (
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Purged Linguistic Inflations</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {output.jargon.map((j, i) => (
                      <span key={i} style={{ padding: "8px 16px", background: "rgba(239, 68, 68, 0.05)", color: "#ef4444", borderRadius: "8px", fontSize: "13px", fontFamily: "var(--font-mono)", border: "1px solid rgba(239, 68, 68, 0.15)", textDecoration: "line-through" }}>
                        {j}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State Interface Guide */
            <div style={{ flex: 1, borderRadius: "20px", border: "1px dashed var(--border)", display: "flex", flexDirection: "column", padding: "48px", background: "#0b0b0e" }}>
              {loading ? (
                <div style={{ margin: "auto", textAlign: "center" }}>
                  <div className="spinner" style={{ width: "40px", height: "40px", borderTopColor: "var(--primary)", margin: "0 auto 24px" }} />
                  <p style={{ fontSize: "14px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Analyzing Speech Matrix...</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: "14px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-main)", marginBottom: "32px" }}>Engine Diagnostics Protocol</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {[
                      ["01 /", "Isolate Context Layer", "Drop messy organizational copy, performance alignment reports, or abstract LinkedIn communications into the frame."],
                      ["02 /", "Calibrate Friction Level", "Toggle through our scaling system. Move from nice translation profiles directly up into high-intensity logical reductions."],
                      ["03 /", "Deconstruct Speak Elements", "Extract plain text representations immediately. Isolate dense structural bloat with full numerical score data."]
                    ].map(([step, title, desc], i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "16px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)", fontSize: "14px", fontWeight: 500 }}>{step}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "6px", letterSpacing: "-0.01em" }}>{title}</div>
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
      </main>

      {/* ── Premium Editorial Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "80px 48px", background: "#060608" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>
            BULL<span style={{ color: "var(--text-muted)" }}>SHIFT</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)", display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            <span>No Accounts Needed</span>
            <span>Zero Tracking Vectors</span>
            <span>No Circle-Backs Permitted</span>
          </div>
          <div style={{ display: "flex", gap: "32px", fontSize: "14px", fontWeight: 500 }}>
            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="var(--text-muted)"}>Privacy Framework</a>
            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="var(--text-muted)"}>Terms Sequence</a>
          </div>
        </div>
      </footer>
    </>
  );
}
