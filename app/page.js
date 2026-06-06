"use client";
import { useState, useEffect, useRef } from "react";

const TONES = [
  { id: 1, label: "Diplomatic",  desc: "Charitable. Still honest." },
  { id: 2, label: "Measured",    desc: "Clear. Some warmth." },
  { id: 3, label: "Balanced",    desc: "Neutral. No padding." },
  { id: 4, label: "Blunt",       desc: "Terse. Says what it means." },
  { id: 5, label: "Obliterate",  desc: "Surgical. Occasionally withering." },
];

const SCORE_VERDICTS = [
  [0,  9,  "Barely a trace. Suspiciously reasonable for LinkedIn."],
  [10, 29, "Low-grade. Annoying but forgivable."],
  [30, 49, "Moderate. This person attended at least one offsite."],
  [50, 69, "High. There's a thought buried here. Keep digging."],
  [70, 84, "Severe. Communication has left the building."],
  [85, 100,"Terminal. Pure vibes. Zero information."],
];

const SCORE_BADGES = [
  [0,  29, { label: "Low BS",  bg: "#ecfdf5", color: "#1f2937", border: "#d1d5db" }],
  [30, 59, { label: "Mid BS",  bg: "#fef3c7", color: "#92400e", border: "#fde68a" }],
  [60, 100,{ label: "High BS", bg: "#fee2e2", color: "#991b1b", border: "#fecaca" }],
];

const EXAMPLES = [
  "Excited to share that I've been on an incredible journey of self-disruption, leveraging my authentic personal brand to ideate at the intersection of purpose and scalability.",
  "We need to circle back and synergize our core competencies to ensure we're moving the needle on our key deliverables while staying agile in this ever-evolving landscape.",
  "Just had a powerful conversation with an incredible human. The energy in the room was palpable. So grateful for this season of growth. More soon. 🚀",
  "I was let go today. But honestly? It was the universe redirecting me toward my highest potential. Grateful for the lessons. My DMs are open.",
];

const JARGON_WORDS = [
  "SYNERGIZE", "CIRCLE BACK", "ALIGN", "BOIL THE OCEAN", "TAKE IT OFFLINE",
  "LEVERAGE", "PIVOT", "MOVE THE NEEDLE", "THOUGHT LEADER", "PARADIGM SHIFT",
  "LOW-HANGING FRUIT", "BANDWIDTH", "DEEP DIVE", "TOUCH BASE", "WHEELHOUSE"
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
          <span key={i} className="marquee-item">{word} •</span>
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
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="spotlight-wrapper"
      style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` }}
    >
      <div className="spotlight-base">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "12px" }}>
          Original (Hover to Reveal Truth)
        </div>
        <p style={{ fontSize: "16px", lineHeight: 1.6 }}>{original}</p>
      </div>
      <div className="spotlight-reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--primary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "12px" }}>
          Shifted Translation
        </div>
        <p style={{ fontSize: "18px", fontWeight: 500, lineHeight: 1.6 }}>{shifted}</p>
        {note && (
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)", fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic" }}>
            ✨ {note}
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
      alert("Translation failed. The jargon wins this round.");
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
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-main)" }}>
            Bull<span style={{ color: "var(--primary)" }}>Shift</span>
          </div>
          <div style={{ background: "#f3f4f6", borderRadius: "20px", padding: "4px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
            LinkedIn decoded, no mercy.
          </div>
        </div>
      </header>

      <InfiniteMarquee />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }} className="animate-fade-up">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "48px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>The Offense</label>
                <button onClick={loadExample} style={{ background: "none", border: "none", fontSize: "13px", color: "var(--primary)", cursor: "pointer", fontWeight: 500 }}>
                  Load example →
                </button>
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste the LinkedIn post, email, or meeting note that made you lose faith in language..."
                style={{ width: "100%", minHeight: "180px", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.6, resize: "vertical", outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 4px var(--ring)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "12px" }}>Select Tone</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 500, background: tone === t.id ? "var(--text-main)" : "var(--surface)", color: tone === t.id ? "#fff" : "var(--text-muted)", border: `1px solid ${tone === t.id ? "var(--text-main)" : "var(--border)"}`, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
                {TONES[tone - 1].desc}
              </div>
            </div>

            <button
              onClick={runShift}
              disabled={loading || !input.trim()}
              style={{ width: "100%", padding: "16px", borderRadius: "12px", background: loading || !input.trim() ? "#e5e7eb" : "var(--primary)", color: loading || !input.trim() ? "#9ca3af" : "#fff", fontSize: "16px", fontWeight: 600, border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "background 0.2s" }}
            >
              {loading ? <div className="spinner" /> : "Shift It"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>The Translation</label>
            
            {output && !loading ? (
              <div className="animate-fade-up">
                <SpotlightCard original={input} shifted={output.translation} note={output.note} />
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "24px", padding: "24px", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                      Jargon Severity
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                      <span style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1 }}>{scoreVal}/100</span>
                      <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
                      {getVerdict(scoreVal)}
                    </div>
                  </div>
                  <button onClick={copyOutput} style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                    {copyState === "copied" ? "Copied ✓" : "Copy Text"}
                  </button>
                </div>

                {output.jargon?.length > 0 && (
                  <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {output.jargon.map((j, i) => (
                      <span key={i} style={{ padding: "4px 12px", background: "#fef2f2", color: "#991b1b", borderRadius: "6px", fontSize: "13px", border: "1px solid #fee2e2", textDecoration: "line-through" }}>
                        {j}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: "220px", borderRadius: "16px", border: "1px dashed var(--border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", background: "var(--surface)", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>✨</span>
                <p style={{ fontSize: "14px" }}>{loading ? "Translating..." : "Your plain English translation will appear here."}</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
