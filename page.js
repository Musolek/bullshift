"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

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
  [0,  29, { label: "Low BS",  bg: "#e6f9f5", color: "#007a60", border: "#9fe1cb" }],
  [30, 59, { label: "Mid BS",  bg: "#fffbeb", color: "#8a5c00", border: "#fac775" }],
  [60, 100,{ label: "High BS", bg: "#fff0ee", color: "#8b2200", border: "#f5c4b3" }],
];

const EXAMPLES = [
  "Excited to share that I've been on an incredible journey of self-disruption, leveraging my authentic personal brand to ideate at the intersection of purpose and scalability.",
  "We need to circle back and synergize our core competencies to ensure we're moving the needle on our key deliverables while staying agile in this ever-evolving landscape.",
  "Just had a powerful conversation with an incredible human. The energy in the room was palpable. So grateful for this season of growth. More soon. 🚀",
  "I was let go today. But honestly? It was the universe redirecting me toward my highest potential. Grateful for the lessons. My DMs are open.",
];

const ONBOARDING_STEPS = [
  {
    emoji: "💩",
    title: "Welcome to BullShift",
    body: "The internet runs on corporate jargon. Someone has to translate. That someone is us.",
    cta: "Let's go",
  },
  {
    emoji: "🔍",
    title: "Paste the offense",
    body: "Drop any LinkedIn post, email, or meeting note that made you lose faith in language.",
    cta: "Got it",
  },
  {
    emoji: "🎚️",
    title: "Pick your tone",
    body: "From Diplomatic (charitable) to Obliterate (surgical). The truth at whatever temperature you need it.",
    cta: "Beautiful",
  },
  {
    emoji: "⚡",
    title: "Get the shift",
    body: "We decode it, score the jargon severity, and flag every phrase that needs to retire.",
    cta: "Start shifting",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getVerdict(score) {
  for (const [lo, hi, txt] of SCORE_VERDICTS) if (score >= lo && score <= hi) return txt;
  return "";
}
function getBadge(score) {
  for (const [lo, hi, b] of SCORE_BADGES) if (score >= lo && score <= hi) return b;
  return SCORE_BADGES[2][2];
}
function scoreColor(score) {
  if (score < 30) return "#009f85";
  if (score < 60) return "#c08a00";
  return "#b83225";
}

// ─── Onboarding Modal ────────────────────────────────────────────────────────

function OnboardingModal({ onDismiss }) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const next = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 300);
  };

  const current = ONBOARDING_STEPS[step];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,10,10,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: exiting ? "backdropOut 0.3s ease forwards" : "backdropIn 0.3s ease forwards",
      }}
      onClick={e => e.target === e.currentTarget && handleDismiss()}
    >
      <div style={{
        background: "#fff",
        border: "2px solid #0a0a0a",
        borderRadius: "14px",
        padding: "40px 36px 32px",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "6px 6px 0 #ffe135",
        animation: exiting ? "modalOut 0.3s ease forwards" : "modalIn 0.35s cubic-bezier(.16,1,.3,1) forwards",
        position: "relative",
      }}>
        {/* Step dots */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "28px" }}>
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === step ? "#0a0a0a" : "#e0dbd0",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px", lineHeight: 1 }}>{current.emoji}</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "22px",
            letterSpacing: "-0.5px", marginBottom: "12px", color: "#0a0a0a",
          }}>{current.title}</h2>
          <p style={{
            fontSize: "15px", lineHeight: 1.7, color: "#6b6560",
            fontFamily: "'Instrument Sans', sans-serif", marginBottom: "28px",
          }}>{current.body}</p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={next} style={{
            padding: "13px 20px",
            background: "#ffe135", color: "#0a0a0a",
            border: "2px solid #0a0a0a", borderRadius: "8px",
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "15px",
            cursor: "pointer", boxShadow: "3px 3px 0 #0a0a0a",
            transition: "all 0.12s",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "5px 5px 0 #0a0a0a"; e.currentTarget.style.transform = "translate(-1px,-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "3px 3px 0 #0a0a0a"; e.currentTarget.style.transform = "none"; }}
          >
            {current.cta}
          </button>
          <button onClick={handleDismiss} style={{
            padding: "10px", background: "transparent", border: "none",
            fontFamily: "'DM Mono', monospace", fontSize: "11px",
            color: "#aaa", cursor: "pointer", letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            skip intro
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function BullShift() {
  const [input, setInput]           = useState("");
  const [output, setOutput]         = useState(null);
  const [tone, setTone]             = useState(3);
  const [loading, setLoading]       = useState(false);
  const [history, setHistory]       = useState([]);
  const [toast, setToast]           = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [scoreAnim, setScoreAnim]   = useState(0);
  const [copyState, setCopyState]   = useState("idle");
  const [shareState, setShareState] = useState("idle");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [colVisible, setColVisible] = useState(false);
  const loadBarRef = useRef(null);

  // Mount animations + first-visit onboarding
  useEffect(() => {
    setMounted(true);
    setTimeout(() => setHeaderVisible(true), 80);
    setTimeout(() => setColVisible(true), 220);
    const seen = localStorage.getItem("bs_seen_v3");
    if (!seen) setShowOnboarding(true);
  }, []);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem("bs_seen_v3", "1");
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  const loadExample = () => {
    const pool = EXAMPLES.filter(e => e !== input);
    setInput(pool[Math.floor(Math.random() * pool.length)]);
    setOutput(null);
    setScoreAnim(0);
  };

  // ── Loading bar helpers ──
  const startLoad = () => {
    if (!loadBarRef.current) return;
    loadBarRef.current.style.transition = "width 3s ease";
    loadBarRef.current.style.width = "70%";
  };
  const finishLoad = () => {
    if (!loadBarRef.current) return;
    loadBarRef.current.style.transition = "width 0.2s ease";
    loadBarRef.current.style.width = "100%";
    setTimeout(() => {
      if (loadBarRef.current) {
        loadBarRef.current.style.transition = "opacity 0.3s ease";
        loadBarRef.current.style.opacity = "0";
        setTimeout(() => {
          if (loadBarRef.current) {
            loadBarRef.current.style.width = "0";
            loadBarRef.current.style.opacity = "1";
          }
        }, 350);
      }
    }, 300);
  };

  const runShift = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput(null);
    setScoreAnim(0);
    startLoad();

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
      setHistory(prev => [{ input, ...data }, ...prev].slice(0, 12));
      setTimeout(() => setScoreAnim(data.score || 0), 100);
    } catch {
      showToast("Translation failed. The jargon wins this round.");
    }

    finishLoad();
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runShift();
  };

  const copyOutput = async () => {
    if (!output?.translation) return;
    await navigator.clipboard.writeText(output.translation);
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 1800);
  };

  const shareOutput = async () => {
    if (!output?.translation) return;
    const text = `Original:\n"${input}"\n\nBullShifted:\n"${output.translation}"\n\nbullshift.app`;
    await navigator.clipboard.writeText(text);
    setShareState("shared");
    showToast("Shareable text copied");
    setTimeout(() => setShareState("idle"), 1800);
  };

  const loadFromHistory = (item) => {
    setInput(item.input);
    setOutput({ translation: item.translation, score: item.score, jargon: item.jargon, note: item.note });
    setTimeout(() => setScoreAnim(item.score || 0), 100);
  };

  const scoreVal = output ? Math.max(0, Math.min(100, parseInt(output.score) || 0)) : 0;
  const badge = output ? getBadge(scoreVal) : null;

  if (!mounted) return null;

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --bs: #0a0a0a;
          --bg: #fffbf4;
          --yellow: #ffe135;
          --yellow-dark: #c9aa00;
          --orange: #ff6b35;
          --teal: #00c9a7;
          --teal-dark: #009f85;
          --pink: #ff4d8b;
          --muted: #7a7570;
          --border: rgba(10,10,10,0.13);
          --head: 'Syne', sans-serif;
          --sans: 'Instrument Sans', -apple-system, sans-serif;
          --mono: 'DM Mono', monospace;
        }
        body { font-family: var(--sans); background: var(--bg); color: var(--bs); min-height: 100vh; -webkit-font-smoothing: antialiased; }
        ::selection { background: #ffe135; color: #0a0a0a; }

        @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes modalIn     { from { opacity: 0; transform: scale(0.94) translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes modalOut    { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(0.94) translateY(12px); } }
        @keyframes fadeUp      { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes slideDown   { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes blink       { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes pulse       { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes scoreReveal { from { width: 0; } }

        .header-anim  { animation: slideDown 0.5s cubic-bezier(.16,1,.3,1) forwards; }
        .col-anim     { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) 0.15s both; }
        .result-anim  { animation: fadeUp 0.4s cubic-bezier(.16,1,.3,1) forwards; }

        textarea {
          width: 100%; padding: 16px; min-height: 150px; resize: vertical;
          font-family: var(--sans); font-size: 14px; line-height: 1.8;
          color: var(--bs); background: #fff;
          border: 2px solid var(--border); border-radius: 10px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        textarea:focus { border-color: var(--bs); box-shadow: 3px 3px 0 var(--yellow); }
        textarea::placeholder { color: var(--muted); font-style: italic; }

        .btn-shift {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 15px 20px; margin-top: 6px;
          background: var(--yellow); color: var(--bs);
          border: 2px solid var(--bs); border-radius: 10px;
          font-family: var(--head); font-size: 17px; font-weight: 800;
          letter-spacing: -0.3px; cursor: pointer;
          box-shadow: 3px 3px 0 var(--bs);
          transition: box-shadow 0.12s, transform 0.12s, background 0.15s;
        }
        .btn-shift:hover:not(:disabled) { box-shadow: 5px 5px 0 var(--bs); transform: translate(-1px,-1px); }
        .btn-shift:active:not(:disabled) { box-shadow: 1px 1px 0 var(--bs); transform: translate(1px,1px); }
        .btn-shift:disabled { background: #e8e3d8; color: var(--muted); box-shadow: none; cursor: not-allowed; border-color: var(--border); }
        .btn-shift.loading { animation: pulse 1.2s ease-in-out infinite; }
        .btn-shift .arrow { display: inline-block; transition: transform 0.2s; }
        .btn-shift:hover:not(:disabled) .arrow { transform: translateX(5px); }

        .spinner { width: 16px; height: 16px; border: 2.5px solid rgba(10,10,10,0.2); border-top-color: var(--bs); border-radius: 50%; animation: spin 0.65s linear infinite; flex-shrink: 0; }

        .tone-pill {
          padding: 6px 13px; border: 1.5px solid var(--border); border-radius: 20px;
          font-family: var(--mono); font-size: 11px; cursor: pointer; background: #fff; color: var(--muted);
          transition: all 0.15s; white-space: nowrap;
        }
        .tone-pill:hover { border-color: var(--bs); color: var(--bs); }
        .tone-pill.active { background: var(--bs); color: #fff; border-color: var(--bs); }

        .btn-action {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 14px; background: #fff; border: 1.5px solid var(--border); border-radius: 8px;
          font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--muted); cursor: pointer; transition: all 0.15s;
        }
        .btn-action:hover { background: var(--bs); color: #fff; border-color: var(--bs); }
        .btn-action.done  { background: var(--teal); color: #fff; border-color: var(--teal-dark); }

        .hist-item {
          padding: 10px 13px; background: #fff; border: 1.5px solid var(--border);
          border-radius: 8px; cursor: pointer; transition: all 0.15s;
        }
        .hist-item:hover { border-color: var(--bs); box-shadow: 2px 2px 0 var(--yellow); }

        .output-box {
          min-height: 150px; padding: 18px; background: #fff;
          border: 2px solid var(--border); border-radius: 10px;
          font-family: var(--sans); font-size: 14px; line-height: 1.8;
          color: var(--bs); transition: border-color 0.2s, box-shadow 0.2s;
        }
        .output-box.has-content { border-color: var(--bs); box-shadow: 3px 3px 0 var(--teal); }

        .score-box {
          padding: 16px 18px; background: #fff; border: 2px solid var(--bs);
          border-radius: 10px; box-shadow: 3px 3px 0 var(--bs);
        }
        .score-fill { height: 100%; border-radius: 3px; transition: width 0.9s cubic-bezier(.16,1,.3,1); }

        @media (max-width: 720px) {
          .layout { grid-template-columns: 1fr !important; }
          .col-left { border-right: none !important; border-bottom: 2px dashed var(--border); }
          .masthead { padding: 14px 20px !important; flex-wrap: wrap; }
          .logo { font-size: 30px !important; }
          .col { padding: 22px 20px !important; }
        }
      `}</style>

      {/* ── Onboarding modal ── */}
      {showOnboarding && <OnboardingModal onDismiss={dismissOnboarding} />}

      {/* ── Loading bar ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 500, pointerEvents: "none" }}>
        <div ref={loadBarRef} style={{ height: "100%", background: "var(--orange)", width: "0", borderRadius: "0 2px 2px 0" }} />
      </div>

      {/* ── Toast ── */}
      <div style={{
        position: "fixed", bottom: "28px", left: "50%",
        transform: `translateX(-50%) translateY(${toastVisible ? "0" : "60px"})`,
        background: "#0a0a0a", color: "#fff",
        fontFamily: "var(--mono)", fontSize: "12px", letterSpacing: "0.06em",
        padding: "10px 20px", borderRadius: "8px",
        transition: "transform 0.3s cubic-bezier(.16,1,.3,1)",
        zIndex: 600, pointerEvents: "none",
      }}>{toast}</div>

      {/* ── Masthead ── */}
      <header
        className={headerVisible ? "header-anim" : ""}
        style={{
          opacity: headerVisible ? undefined : 0,
          background: "#0a0a0a", color: "#fff",
          padding: "18px 36px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "16px", position: "relative", overflow: "hidden",
        }}
      >
        {/* Repeating BS watermark */}
        <div style={{
          position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)",
          fontFamily: "var(--head)", fontSize: "13px", fontWeight: 800,
          color: "rgba(255,255,255,0.05)", letterSpacing: "4px",
          whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none",
        }}>
          BS BS BS BS BS BS BS BS BS BS BS BS
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Logo */}
          <div style={{
            fontFamily: "var(--head)", fontSize: "38px", fontWeight: 800,
            lineHeight: 1, letterSpacing: "-1.5px",
          }}>
            <span style={{ color: "#fff" }}>Bull</span>
            <span style={{ color: "#ffe135" }}>Shift</span>
            <span style={{
              display: "inline-block", width: "10px", height: "10px",
              background: "#ff6b35", borderRadius: "50%",
              marginLeft: "4px", verticalAlign: "middle",
              animation: "blink 2s ease-in-out infinite",
            }} />
          </div>
          <div style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "20px", padding: "5px 14px",
            fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.75)",
          }}>
            LinkedIn decoded, no mercy
          </div>
        </div>

        {/* Help button */}
        <button
          onClick={() => setShowOnboarding(true)}
          style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.75)", fontFamily: "var(--mono)", fontSize: "13px",
            cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
          title="How it works"
        >?</button>
      </header>

      {/* ── Two-column layout ── */}
      <div
        className={colVisible ? "col-anim" : ""}
        style={{
          opacity: colVisible ? undefined : 0,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* ── LEFT: Input ── */}
        <div className="col col-left" style={{ padding: "28px 36px", borderRight: "2px dashed rgba(10,10,10,0.13)" }}>

          <div style={{
            fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--muted)",
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff6b35", flexShrink: 0 }} />
            The original offense
          </div>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste the LinkedIn post, email, or meeting note that made you lose faith in language..."
            maxLength={2000}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--muted)" }}>
              {input.length}/2000
            </span>
            <button
              onClick={loadExample}
              style={{
                fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.06em",
                textTransform: "uppercase", color: "#3d6bff", background: "none",
                border: "none", cursor: "pointer", padding: 0, transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#0a0a0a"}
              onMouseLeave={e => e.currentTarget.style.color = "#3d6bff"}
            >
              load example →
            </button>
          </div>

          {/* Tone */}
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontFamily: "var(--head)", fontSize: "16px", fontWeight: 800, letterSpacing: "-0.3px" }}>
                {TONES[tone - 1].label}
              </span>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                {TONES[tone - 1].desc}
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {TONES.map(t => (
                <button
                  key={t.id}
                  className={`tone-pill ${tone === t.id ? "active" : ""}`}
                  onClick={() => setTone(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shift button */}
          <button
            className={`btn-shift ${loading ? "loading" : ""}`}
            onClick={runShift}
            disabled={loading || !input.trim()}
          >
            {loading
              ? <><div className="spinner" /><span>Shifting...</span></>
              : <span>Shift it <span className="arrow">→</span></span>
            }
          </button>

          <div style={{ marginTop: "8px", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.04em" }}>
              ⌘ + Enter to shift
            </span>
          </div>

          {/* Score */}
          {output && (
            <div className="score-box result-anim" style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "2px" }}>
                    Jargon severity
                  </span>
                  <span style={{ fontFamily: "var(--head)", fontSize: "28px", fontWeight: 800, lineHeight: 1, color: scoreColor(scoreVal) }}>
                    {scoreVal}/100
                  </span>
                </div>
                {badge && (
                  <span style={{
                    background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                    padding: "4px 10px", borderRadius: "4px",
                    fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em",
                  }}>
                    {badge.label}
                  </span>
                )}
              </div>
              <div style={{ height: "6px", background: "#f0ece4", borderRadius: "3px", overflow: "hidden" }}>
                <div className="score-fill" style={{ width: `${scoreAnim}%`, background: scoreColor(scoreVal) }} />
              </div>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                {getVerdict(scoreVal)}
              </div>
            </div>
          )}

          {/* Jargon tags */}
          {output?.jargon?.length > 0 && (
            <div className="result-anim" style={{ marginTop: "16px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
                Jargon detected
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {output.jargon.map((j, i) => (
                  <span key={i} style={{
                    fontFamily: "var(--mono)", fontSize: "11px", padding: "3px 10px",
                    background: "#ffe5e5", color: "#b83225",
                    border: "1px solid #ffbfbf", borderRadius: "4px",
                    textDecoration: "line-through",
                  }}>{j}</span>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          <div style={{ marginTop: "28px", borderTop: "2px dashed rgba(10,10,10,0.13)", paddingTop: "20px" }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.16em",
              textTransform: "uppercase", color: "var(--muted)",
              display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00c9a7", flexShrink: 0 }} />
              Recent translations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
              {history.length === 0
                ? <span style={{ fontSize: "13px", color: "var(--muted)", fontStyle: "italic" }}>Nothing shifted yet. Go ahead.</span>
                : history.map((item, i) => (
                    <div key={i} className="hist-item" onClick={() => loadFromHistory(item)}>
                      <div style={{ fontSize: "12px", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "3px" }}>
                        {item.input}
                      </div>
                      <div style={{ fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.translation}
                        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "#ff6b35", marginLeft: "7px" }}>
                          {item.score}/100
                        </span>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>

        {/* ── RIGHT: Output ── */}
        <div className="col" style={{ padding: "28px 36px" }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--muted)",
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00c9a7", flexShrink: 0 }} />
            What it actually means
          </div>

          <div className={`output-box ${output ? "has-content" : ""}`}>
            {!output && !loading && (
              <span style={{ color: "var(--muted)", fontStyle: "italic" }}>The translation will appear here.</span>
            )}
            {loading && (
              <span style={{ color: "var(--muted)", fontStyle: "italic" }}>Translating...</span>
            )}
            {output && !loading && (
              <div className="result-anim">
                <div>{output.translation}</div>
                {output.note && (
                  <div style={{
                    marginTop: "14px", paddingTop: "12px",
                    borderTop: "1.5px dashed rgba(10,10,10,0.13)",
                    fontSize: "12px", color: "var(--muted)", fontStyle: "italic",
                  }}>
                    — {output.note}
                  </div>
                )}
              </div>
            )}
          </div>

          {output && !loading && (
            <div className="result-anim" style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              <button className={`btn-action ${copyState === "copied" ? "done" : ""}`} onClick={copyOutput}>
                {copyState === "copied" ? "Copied ✓" : "Copy"}
              </button>
              <button className={`btn-action ${shareState === "shared" ? "done" : ""}`} onClick={shareOutput}>
                Share
              </button>
              <button className="btn-action" onClick={() => { setInput(""); setOutput(null); setScoreAnim(0); }}>
                Clear
              </button>
            </div>
          )}

          {/* How it works — visible on right when no output */}
          {!output && (
            <div style={{ marginTop: "32px" }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.14em",
                textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px",
              }}>
                How it works
              </div>
              {[
                ["💩", "Paste the jargon", "LinkedIn post, email, whatever broke your brain today."],
                ["🎚️", "Set the tone", "From Diplomatic to Obliterate. Your call."],
                ["⚡", "Get the shift", "Plain English. Jargon score. Zero mercy."],
              ].map(([icon, title, desc], i) => (
                <div key={i} style={{
                  display: "flex", gap: "14px", alignItems: "flex-start",
                  marginBottom: "16px",
                  animation: `fadeUp 0.4s cubic-bezier(.16,1,.3,1) ${i * 80}ms both`,
                }}>
                  <span style={{ fontSize: "22px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--head)", fontWeight: 800, fontSize: "14px", letterSpacing: "-0.2px", marginBottom: "2px" }}>{title}</div>
                    <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        background: "#0a0a0a", color: "rgba(255,255,255,0.45)",
        borderTop: "2px solid #0a0a0a",
        padding: "16px 36px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "8px",
        fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.05em",
      }}>
        <div>No sign-up. No tracking. No &quot;circle-backs.&quot;</div>
        <div style={{ display: "flex", gap: "18px" }}>
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
          >Privacy</a>
          <a href="/terms" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
          >Terms</a>
          <span>© 2026 BullShift</span>
        </div>
      </footer>
    </>
  );
}
