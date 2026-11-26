"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./home.css";

const TONES = ["Diplomatic", "Measured", "Balanced", "Blunt", "Obliterate"];
const DESC = [
  "Kind to the author. Still true.",
  "Clear, with a little warmth.",
  "Just the facts. No spin either way.",
  "Short. Says the quiet part.",
  "Sharp and a bit withering. Never cruel.",
];

const EXAMPLES = [
  { label: "a layoff", text: "We're thrilled to announce a strategic realignment of our talent pipeline as we sharpen focus on long-term value creation." },
  { label: "a humblebrag", text: "Humbled and honored to share that I've been named a Top Voice in Thought Leadership. None of this would be possible without my incredible network. Grateful beyond words. #blessed" },
  { label: "a meeting", text: "Let's circle back offline to align on next steps and ensure we're all rowing in the same direction before the deliverable is socialized." },
];

// Hand-written editor's picks. They are not user data and are not model output.
const PICKS = [
  { from: EXAMPLES[0].text, to: "We fired people and hired a thesaurus to explain it.", score: 88, tone: "Obliterate", pick: true },
  { from: EXAMPLES[1].text, to: "Look at my badge. Please.", score: 79, tone: "Blunt", pick: true },
  { from: EXAMPLES[2].text, to: "Let's talk later and agree on a plan before we share this.", score: 83, tone: "Balanced", pick: true },
];

const LEVELS = [
  "The company is reducing its team to manage costs. It is a hard decision, and they are presenting it as a plan.",
  "The company is laying people off to cut costs.",
  "We are laying people off.",
  "Layoffs. Costs went up, so people went out.",
  "We fired people and hired a thesaurus to explain it.",
];

const LIT_TEXT =
  "“I’m humbled to announce” means “I want you to know.” “Let’s circle back” means “not now.” “We’re restructuring” means someone lost a job. BullShift says the quiet part out loud.";

const FAQS = [
  ["What is BullShift?", "A free tool that translates LinkedIn and corporate jargon into plain English. Paste something, pick how blunt you want the answer, and read what the author most likely meant."],
  ["Is it free?", "Yes. No sign-up, no paywall."],
  ["What happens to what I paste?", "Your text goes to Anthropic’s Claude to produce the translation and is not stored by BullShift. Your recent translations stay in your own browser."],
  ["Is the translation accurate?", "It is an educated guess about tone and intent, written to be funny and fair. It cannot read minds, and it does not know the author. Use it for a laugh, or for a sanity check on a vague message."],
  ["What does the jargon score mean?", "0 is plain speech. 100 is a paragraph with nothing in it. It rates the text you pasted, not the person who wrote it."],
];

const PEN_KEY = "bs-pen";

function verdictFor(s) {
  if (s < 30) return "Mostly human.";
  if (s < 60) return "Some padding.";
  if (s < 85) return "Heavy fog.";
  return "Pure fog. Nothing to hold on to.";
}
function short(s, n) {
  return s.length > n ? s.slice(0, n - 1).trim() + "…" : s;
}
function progress(el) {
  const r = el.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
}

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [barOn, setBarOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mine, setMine] = useState([]);
  const [level, setLevel] = useState(0);
  const [swap, setSwap] = useState(false);
  const [shownLevel, setShownLevel] = useState(0);

  const taRef = useRef(null);
  const topRef = useRef(null);
  const resultRef = useRef(null);
  const sayRef = useRef(null);
  const levelsRef = useRef(null);
  const wordRefs = useRef([]);

  /* Curtain: the inline script in layout.js adds html.curtain-on once per session. */
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("curtain-on")) return;
    let done = false;
    const timers = [];
    const finish = () => {
      if (done) return;
      done = true;
      root.classList.remove("curtain-on", "curtain-go");
      try { sessionStorage.setItem("bsc", "1"); } catch (e) {}
      window.scrollTo(0, 0);
    };
    const lift = () => {
      root.classList.add("curtain-go");
      timers.push(setTimeout(finish, 1700));
    };
    timers.push(setTimeout(lift, 800));
    return () => { timers.forEach(clearTimeout); finish(); };
  }, []);

  /* Bullpen: the visitor's own list lives in this browser only. */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PEN_KEY) || "[]");
      if (Array.isArray(saved)) setMine(saved.slice(0, 12));
    } catch (e) {}
  }, []);
  const saveMine = useCallback((list) => {
    setMine(list);
    try { localStorage.setItem(PEN_KEY, JSON.stringify(list)); } catch (e) {}
  }, []);

  /* Scroll-lit sentence and the five-levels stage. */
  const litWords = LIT_TEXT.split(/\s+/);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let ticking = false;
    const tick = () => {
      ticking = false;
      if (sayRef.current) {
        const n = Math.round(Math.min(1, progress(sayRef.current) / 0.8) * litWords.length);
        wordRefs.current.forEach((w, i) => { if (w) w.style.opacity = i < n ? 1 : 0.2; });
      }
      if (levelsRef.current) {
        setLevel(Math.min(4, Math.floor(progress(levelsRef.current) * 5)));
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (level === shownLevel) return;
    setSwap(true);
    const t = setTimeout(() => { setShownLevel(level); setSwap(false); }, 160);
    return () => clearTimeout(t);
  }, [level, shownLevel]);

  async function translate() {
    if (busy) return;
    if (!text.trim()) { taRef.current?.focus(); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone: TONES[tone] }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
      const r = {
        translation: String(data.translation || ""),
        score: Math.max(0, Math.min(100, Number(data.score) || 0)),
        jargon: Array.isArray(data.jargon) ? data.jargon : [],
        note: data.note ? String(data.note) : "",
      };
      setResult(r);
      setBarOn(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setBarOn(true)));
      saveMine([{ from: text.trim(), to: r.translation, score: r.score, tone: TONES[tone] }, ...mine].slice(0, 12));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(result.translation); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function loadFromPen(p) {
    setText(p.from);
    setTone(Math.max(0, TONES.indexOf(p.tone)));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const pen = [...mine, ...PICKS];

  return (
    <>
      <div className="curtain" aria-hidden="true">
        <i /><i /><i />
        <span><img src="/logo.png" alt="" />BullShift</span>
      </div>

      <Header />

      <main id="main">
        {/* 1. Hero and tool */}
        <section className="hero" id="top" ref={topRef}>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">A LinkedIn-to-English dictionary</p>
              <h1>Paste the jargon. Get the <mark>truth.</mark></h1>
              <p className="lede">BullShift reads corporate speak and tells you what the person actually meant. You pick how blunt it gets.</p>
              <p className="tryline">
                Nothing to paste? Try one:{" "}
                {EXAMPLES.map((ex) => (
                  <button key={ex.label} className="chip" onClick={() => { setText(ex.text); taRef.current?.focus(); }}>
                    {ex.label}
                  </button>
                ))}
              </p>
            </div>

            <div className="tool" id="tool">
              <label className="tlabel" htmlFor="input">Paste the post</label>
              <textarea
                id="input"
                ref={taRef}
                rows={6}
                maxLength={2000}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") translate(); }}
                placeholder="We're thrilled to announce a strategic realignment of our talent pipeline…"
              />
              <div className="count"><span>{text.length}</span> / 2000</div>

              <p className="tlabel">How blunt?</p>
              <div className="tones" role="radiogroup" aria-label="Bluntness">
                {TONES.map((t, i) => (
                  <button key={t} role="radio" aria-checked={tone === i} onClick={() => setTone(i)}>{t}</button>
                ))}
              </div>
              <p className="tonedesc">{DESC[tone]}</p>

              <button className="go" onClick={translate} disabled={busy}>
                {busy ? "Reading… " : "Translate "}<span aria-hidden="true">→</span>
              </button>

              {error && <p className="note" role="alert">{error}</p>}

              {result && (
                <div className="result" ref={resultRef} aria-live="polite">
                  <p className="tlabel">What they meant</p>
                  <p className="out">{result.translation}</p>
                  <div className="score">
                    <div className="score-top"><span>Jargon score</span><b>{result.score}</b><em>/ 100</em></div>
                    <div className="bar"><i style={{ width: barOn ? result.score + "%" : 0 }} /></div>
                    <p className="verdict">{verdictFor(result.score)}</p>
                  </div>
                  {result.jargon.length > 0 && (
                    <div className="flagged">
                      <p className="tlabel">Phrases doing the hiding</p>
                      <p>{result.jargon.map((j, i) => <span key={i}>{j}</span>)}</p>
                    </div>
                  )}
                  {result.note && <p className="note">{result.note}</p>}
                  <div className="actions">
                    <button className="ghost" onClick={copy}>{copied ? "Copied" : "Copy translation"}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. Scroll-lit sentence */}
        <section className="sheet say" id="say" ref={sayRef}>
          <div className="say-stage">
            <p className="lit">
              {litWords.map((w, i) => (
                <span key={i} className="w" ref={(el) => (wordRefs.current[i] = el)}>{w}{" "}</span>
              ))}
            </p>
          </div>
        </section>

        {/* 3. How it works */}
        <section className="sheet how" id="how">
          <div className="wrap">
            <p className="eyebrow">How it works</p>
            <h2>Three steps. About ten seconds.</h2>
            <div className="steps">
              <article><span>1</span><h3>Paste it</h3><p>A post, an email, a job ad. Up to 2,000 characters.</p></article>
              <article><span>2</span><h3>Pick how blunt</h3><p>Five settings, from kind to withering.</p></article>
              <article><span>3</span><h3>Read what they meant</h3><p>You get the plain version, a jargon score, and the exact phrases that did the hiding.</p></article>
            </div>
          </div>
        </section>

        {/* 4. Five levels */}
        <section className="sheet levels" id="levels" ref={levelsRef}>
          <div className="levels-stage">
            <div className="wrap">
              <p className="eyebrow">Five levels</p>
              <h2>Same sentence. Five levels of honesty.</h2>
              <blockquote className="src">“We’re realigning our talent pipeline to unlock long-term value.”</blockquote>
              <div className="dial" aria-hidden="true">
                {TONES.map((t, i) => <i key={t} className={i <= level ? "on" : ""} />)}
              </div>
              <p className="lvl-name">{TONES[shownLevel]}</p>
              <p className={"lvl-out" + (swap ? " swap" : "")}>{LEVELS[shownLevel]}</p>
              <p className="lvl-hint">Keep scrolling</p>
            </div>
          </div>
          <ol className="levels-static">
            {TONES.map((t, i) => <li key={t}><b>{t}</b> {LEVELS[i]}</li>)}
          </ol>
        </section>

        {/* 5. The Bullpen */}
        <section className="sheet bullpen" id="bullpen">
          <div className="wrap">
            <p className="eyebrow">The Bullpen</p>
            <h2>Translations worth reading twice.</h2>
            <p className="lede">Three picks from the editor, then anything you translate here. Your own list stays in this browser and nowhere else.</p>
            <ul className="pen">
              {pen.map((p, i) => (
                <li
                  key={i}
                  tabIndex={0}
                  onClick={() => loadFromPen(p)}
                  onKeyDown={(e) => { if (e.key === "Enter") loadFromPen(p); }}
                >
                  <p className="from">“{short(p.from, 120)}”</p>
                  <p className="to">{short(p.to, 140)}</p>
                  <div className="meta">
                    {p.pick && <span className="tag">Editor’s pick</span>}
                    <b>{p.score}</b>{p.tone}
                  </div>
                </li>
              ))}
            </ul>
            {mine.length > 0 && (
              <button className="ghost" id="clearPen" onClick={() => saveMine([])}>Clear my translations</button>
            )}
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="sheet faq" id="faq">
          <div className="wrap faq-grid">
            <div>
              <p className="eyebrow">Straight answers</p>
              <h2>Questions people ask.</h2>
            </div>
            <div className="qa">
              {FAQS.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
