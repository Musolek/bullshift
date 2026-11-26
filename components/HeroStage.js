"use client";
import { useEffect, useRef, useState } from "react";

const TONES = ["Diplomatic", "Measured", "Balanced", "Blunt", "Obliterate"];

/* Split the pasted text into word tiles and flag the phrases the API named as jargon. */
export function tokenize(text, jargon = []) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const norm = (s) => s.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
  const phrases = jargon
    .map((j) => String(j).trim().split(/\s+/).map(norm).filter(Boolean))
    .filter((p) => p.length)
    .sort((a, b) => b.length - a.length);
  const tokens = [];
  let i = 0;
  while (i < words.length) {
    const hit = phrases.find((p) => p.every((w, k) => norm(words[i + k] || "") === w));
    if (hit) {
      tokens.push({ text: words.slice(i, i + hit.length).join(" "), jargon: true });
      i += hit.length;
    } else {
      tokens.push({ text: words[i], jargon: false });
      i++;
    }
  }
  return tokens;
}

export default function HeroStage({ tone, setTone, text, result }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const toneRef = useRef(tone);
  const textRef = useRef(text);
  const resultRef = useRef(result);
  const [mode, setMode] = useState("idle"); // idle | live | none
  const [score, setScore] = useState(null);
  const [tip, setTip] = useState(null);

  toneRef.current = tone;
  textRef.current = text;
  resultRef.current = result;

  /* Load three.js only after the page is interactive. */
  useEffect(() => {
    let dead = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl = false;
    try { gl = !!document.createElement("canvas").getContext("webgl2"); } catch (e) {}
    if (!gl) { setMode("none"); return; }
    const boot = () => {
      Promise.all([import("../lib/hero-scene"), document.fonts.ready]).then(([m]) => {
        if (dead || !canvasRef.current) return;
        const stage = stageRef.current;
        const scene = m.createScene(canvasRef.current, {
          reduced,
          tooltip: {
            show(html, x, y) { setTip({ html, x: Math.min(x + 14, stage.clientWidth - 200), y: Math.max(8, y - 44) }); },
            hide() { setTip(null); },
          },
          onLevel: (i) => setTone(i),
          onScore: (s) => setScore(s),
        });
        sceneRef.current = scene;
        scene.setLevel(toneRef.current);
        scene.setInput(tokenize(textRef.current || "Paste a post. Watch the jargon pile up."));
        const r = resultRef.current;
        if (r) { scene.setInput(tokenize(textRef.current, r.jargon)); scene.shift({ out: r.translation, score: r.score }); }
        setMode("live");
      }).catch(() => setMode("none"));
    };
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1));
    idle(boot, { timeout: 800 });
    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { sceneRef.current?.setLevel(tone); }, [tone]);

  useEffect(() => {
    const s = sceneRef.current; if (!s) return;
    const t = setTimeout(() => { s.reset(); s.setInput(tokenize(text || "Paste a post. Watch the jargon pile up.")); }, 220);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => {
    const s = sceneRef.current; if (!s || !result) return;
    s.setInput(tokenize(text, result.jargon));
    s.shift({ out: result.translation, score: result.score });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  if (mode === "none") return null;

  return (
    <div className="stage-col" aria-hidden="true">
      <div className="stage" ref={stageRef}>
        <canvas ref={canvasRef} />
        <div className="stage-hud">
          <span className="hud-level">{TONES[tone]}</span>
          <span className="hud-hint">{mode === "live" ? "Turn the dial. Then translate." : "Loading the scene…"}</span>
        </div>
        {score != null && (
          <div className="gauge"><span className="gauge-num">{score}</span><span className="gauge-cap">jargon score</span></div>
        )}
        {tip && <div className="tip" style={{ left: tip.x, top: tip.y }} dangerouslySetInnerHTML={{ __html: tip.html }} />}
      </div>
    </div>
  );
}
