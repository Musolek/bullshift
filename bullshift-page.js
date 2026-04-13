"use client";
import { useState, useEffect, useRef } from "react";

// ─── LOADING MESSAGES ────────────────────────────────
const LOADING_MSGS_ADD = [
  "Injecting synergy...",
  "Deleting honesty from reality...",
  "Consulting the thought leadership council...",
  "Replacing meaning with metrics...",
  "Circle-backing your sentence...",
  "Leveraging your lived experience...",
  "Aligning stakeholders to your lunch...",
];

const LOADING_MSGS_SHIFT = [
  "Deleting 'Synergy' from existence...",
  "Translating ego into English...",
  "Scraping off the corporate veneer...",
  "Extracting the human underneath...",
  "Deprogramming the jargon...",
  "Running honesty protocol...",
  "Locating the actual point...",
];

// ─── EXAMPLE INPUTS ──────────────────────────────────
const EXAMPLES_ADD = [
  "I got fired.",
  "I ate lunch.",
  "I went to a meeting.",
  "I disagree with my boss.",
  "I don't know what I'm doing.",
];

const EXAMPLES_SHIFT = [
  "Thrilled to announce that after much reflection, I've decided to pursue new opportunities that align with my personal growth journey.",
  "Today I had the privilege of connecting with incredible humans over a meal. Reminder: your network is your net worth.",
  "Excited to share that I've been leveraging cross-functional synergies to drive stakeholder alignment across verticals.",
];

// ─── MAIN APP ────────────────────────────────────────
export default function BullShift() {
  const [mode, setMode] = useState("humanToLinkedin");
  const [inp, setInp] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const textareaRef = useRef(null);

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const msgs = mode === "humanToLinkedin" ? LOADING_MSGS_ADD : LOADING_MSGS_SHIFT;
    setLoadMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    const id = setInterval(() => {
      setLoadMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 1800);
    return () => clearInterval(id);
  }, [loading, mode]);

  async function translate() {
    if (!inp.trim()) return;
    setLoading(true);
    setOut("");
    setCopied(false);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inp, mode }),
      });
      const data = await res.json();
      setOut(data.result || "Something broke. Even the bull couldn't save this one.");
    } catch {
      setOut("Translation failed. The corporate gods are not pleased.");
    }
    setLoading(false);
  }

  function copyResult() {
    navigator.clipboard.writeText(out);
    setCopied(true);
    setToastMsg("Go on. Post it. I dare you.");
    setShowToast(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setShowToast(false), 3000);
  }

  function tryExample(text) {
    setInp(text);
    setOut("");
    if (textareaRef.current) textareaRef.current.focus();
  }

  const isAdd = mode === "humanToLinkedin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f4f2ee; color: #1a1a1a; font-family: 'Source Sans 3', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        ::selection { background: #ffe0b2; }
        textarea { font-family: 'Source Sans 3', -apple-system, sans-serif; width: 100%; background: transparent; border: none; color: #1a1a1a; font-size: 15px; padding: 14px 18px; resize: vertical; line-height: 1.65; min-height: 160px; }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #b5b5b5; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 15% { transform: translateX(-3px); } 30% { transform: translateX(3px); } 45% { transform: translateX(-2px); } 60% { transform: translateX(2px); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f4f2ee", position: "relative" }}>

        {/* ─── TOAST ─────────────────────────────── */}
        {showToast && (
          <div style={{
            position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
            background: "#1a1a1a", color: "#fff", padding: "14px 28px",
            borderRadius: 12, fontSize: 14, fontWeight: 600,
            zIndex: 100, animation: "toastIn 0.3s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 0.3,
          }}>
            {toastMsg}
          </div>
        )}

        {/* ─── HEADER ────────────────────────────── */}
        <header style={{
          padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #e0ddd7", background: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #e65100, #ff8a50)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 800,
            }}>BS</div>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>BullShift</span>
          </div>
          <div style={{
            fontSize: 11, color: "#8b8b8b",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 1,
          }}>human ↔ corporate</div>
        </header>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 18px" }}>

          {/* ─── HERO ────────────────────────────── */}
          <section style={{ padding: "42px 0 24px", textAlign: "center" }}>
            <div style={{
              display: "inline-block", padding: "4px 14px", borderRadius: 20,
              background: "#fdf6ee", border: "1px solid #eddcc7",
              fontSize: 12, fontWeight: 600, color: "#b5722a",
              marginBottom: 20, letterSpacing: 0.5,
            }}>
              because "synergy" isn't a personality
            </div>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
              lineHeight: 1.15, marginBottom: 12, letterSpacing: -1,
            }}>
              Google Translate for{" "}
              <span style={{ color: "#e65100" }}>corporate delusion</span>
            </h1>
            <p style={{
              fontSize: 16.5, color: "#6b665e", maxWidth: 460,
              margin: "0 auto 32px", lineHeight: 1.6,
            }}>
              400 words of "thought leadership" is usually just three words of nonsense. End the lie. Fix the post.
            </p>
          </section>

          {/* ─── MODE TOGGLE ─────────────────────── */}
          <div style={{
            display: "flex", gap: 10, justifyContent: "center", marginBottom: 28,
          }}>
            {[
              { id: "humanToLinkedin", icon: "💩", label: "Add the Bull" },
              { id: "linkedinToHuman", icon: "🧍", label: "Shift the Bull" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setOut(""); setInp(""); }}
                style={{
                  flex: 1, maxWidth: 220, padding: "12px 8px", borderRadius: 12,
                  border: `2px solid ${mode === m.id ? "#e65100" : "#e0ddd7"}`,
                  background: mode === m.id ? "#fff4ef" : "#fff",
                  color: mode === m.id ? "#e65100" : "#6b665e",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  textAlign: "center", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 20, display: "block", marginBottom: 4 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* ─── TRANSLATOR ──────────────────────── */}
          <section style={{
            display: "flex", gap: 20, flexWrap: "wrap",
            animation: "fadeIn 0.4s ease",
          }}>
            {/* INPUT */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                background: "#fff", borderRadius: 14,
                border: "1.5px solid #e0ddd7",
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "10px 18px 0",
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: isAdd ? "#8b8b8b" : "#e65100",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {isAdd ? "🧍 Plain English" : "💼 Paste the bull"}
                </div>
                <textarea
                  ref={textareaRef}
                  value={inp}
                  onChange={(e) => setInp(e.target.value)}
                  placeholder={isAdd
                    ? 'e.g. "I got fired."'
                    : "Paste a LinkedIn post here..."
                  }
                />
              </div>

              {/* Example chips */}
              <div style={{
                display: "flex", gap: 6, marginTop: 10,
                flexWrap: "wrap", alignItems: "center",
              }}>
                <span style={{
                  fontSize: 12, color: "#8b8b8b",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>Try:</span>
                {(isAdd ? EXAMPLES_ADD.slice(0, 3) : EXAMPLES_SHIFT).map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => tryExample(isAdd ? ex : ex)}
                    style={{
                      padding: "5px 12px", borderRadius: 20,
                      border: "1px solid #e0ddd7", background: "#fff",
                      color: "#4a4a4a", fontSize: 12.5, cursor: "pointer",
                      fontFamily: "inherit", transition: "border-color 0.2s",
                      maxWidth: isAdd ? "none" : 200, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                  >
                    {isAdd ? ex : ex.slice(0, 38) + "..."}
                  </button>
                ))}
              </div>

              {/* THE BUTTON */}
              <div style={{ marginTop: 18 }}>
                <button
                  onClick={translate}
                  disabled={loading || !inp.trim()}
                  style={{
                    background: loading ? "#1a1a1a" : "#e65100",
                    color: "#fff", border: "none",
                    padding: "13px 32px", borderRadius: 28,
                    fontSize: 15, fontWeight: 700, cursor: loading || !inp.trim() ? "not-allowed" : "pointer",
                    opacity: loading || !inp.trim() ? 0.5 : 1,
                    fontFamily: "inherit",
                    display: "inline-flex", alignItems: "center", gap: 10,
                    transition: "all 0.25s",
                    animation: loading ? "none" : "none",
                    letterSpacing: 0.3,
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: 14, height: 14,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff", borderRadius: "50%",
                        display: "inline-block", animation: "spin 0.6s linear infinite",
                      }} />
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12, letterSpacing: 0.5,
                      }}>{loadMsg}</span>
                    </>
                  ) : (
                    isAdd ? "🔪 CUT THE BULL" : "🧠 EXTRACT TRUTH"
                  )}
                </button>
              </div>
            </div>

            {/* OUTPUT */}
            <div style={{ flex: 1, minWidth: 280 }}>
              {out ? (
                <div style={{ animation: "slideUp 0.4s ease" }}>
                  {isAdd ? (
                    /* LinkedIn-style post card */
                    <div style={{
                      background: "#fff", borderRadius: 14,
                      border: "1px solid #e0ddd7", overflow: "hidden",
                    }}>
                      <div style={{ padding: "16px 18px 12px", display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: "linear-gradient(135deg, #0a66c2, #0d7fd9)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 14, fontWeight: 700,
                        }}>TL</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>Thought Leader</div>
                          <div style={{ fontSize: 11.5, color: "#8b8b8b" }}>Disrupting disruption · 3rd+</div>
                        </div>
                      </div>
                      <div style={{
                        padding: "0 18px 18px",
                        fontSize: 15, lineHeight: 1.7, color: "#333",
                      }}>{out}</div>
                      <div style={{
                        borderTop: "1px solid #eee", padding: "8px 18px",
                        display: "flex", gap: 18,
                      }}>
                        {["👍 Like", "💬 Comment", "🔄 Repost"].map((a) => (
                          <span key={a} style={{ fontSize: 12, color: "#8b8b8b" }}>{a}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Truth card */
                    <div style={{
                      background: "#fdf6ee", border: "1px solid #eddcc7",
                      borderRadius: 14, padding: "20px 24px", minHeight: 120,
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: 2,
                        color: "#b5722a", marginBottom: 12,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>🧍 What they actually mean</div>
                      <div style={{
                        fontSize: 17, lineHeight: 1.7, fontWeight: 500,
                      }}>{out}</div>
                    </div>
                  )}

                  {/* Success message */}
                  <div style={{
                    textAlign: "center", marginTop: 14,
                    fontSize: 12.5, color: "#8b8b8b",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontStyle: "italic",
                  }}>
                    There. It's human again. Don't let it happen again.
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: "flex", justifyContent: "center",
                    marginTop: 12, gap: 10,
                  }}>
                    <button
                      onClick={copyResult}
                      style={{
                        padding: "8px 20px", borderRadius: 20,
                        border: "1.5px solid #e0ddd7", background: "#fff",
                        color: "#e65100", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                    >
                      {copied ? "✓ Copied!" : "📋 Copy"}
                    </button>
                    <button
                      onClick={() => { setInp(""); setOut(""); }}
                      style={{
                        padding: "8px 20px", borderRadius: 20,
                        border: "1.5px solid #e0ddd7", background: "#fff",
                        color: "#6b665e", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                    >
                      🔄 Another
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div style={{
                  background: "#fff", border: "1.5px dashed #e0ddd7",
                  borderRadius: 14, minHeight: 240,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column", gap: 8, padding: 32,
                }}>
                  <div style={{ fontSize: 36, opacity: 0.2 }}>
                    {isAdd ? "💩" : "🧍"}
                  </div>
                  <div style={{ fontSize: 13.5, color: "#b5b5b5", textAlign: "center" }}>
                    {isAdd ? "The bull appears here" : "The truth appears here"}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ─── FOOTER ──────────────────────────── */}
          <footer style={{
            textAlign: "center", padding: "52px 0 28px",
            borderTop: "1px solid #e0ddd7", marginTop: 52,
          }}>
            <div style={{
              fontSize: 13, color: "#8b8b8b", fontWeight: 500,
            }}>
              No sign-up. No tracking. No "circle-backs." Just the shift.
            </div>
            <div style={{
              display: "flex", justifyContent: "center",
              gap: 16, margin: "14px 0",
            }}>
              <a href="/privacy" style={{ fontSize: 12, color: "#8b8b8b", textDecoration: "none" }}>Privacy Policy</a>
              <span style={{ fontSize: 12, color: "#e0ddd7" }}>|</span>
              <a href="/terms" style={{ fontSize: 12, color: "#8b8b8b", textDecoration: "none" }}>Terms of Service</a>
            </div>
            <div style={{ fontSize: 11, color: "#b5b5b5" }}>
              © 2026 BullShift. All rights reserved.
            </div>
            <div style={{
              fontSize: 10, color: "#ccc", marginTop: 6,
              maxWidth: 440, margin: "6px auto 0",
            }}>
              Not affiliated with LinkedIn® or Microsoft. This tool is satire and commentary.
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
