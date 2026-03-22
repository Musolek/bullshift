"use client";
import { useState, useCallback, useEffect } from "react";

/* ── Data ── */
var EXAMPLES = [
  {
    human: "I got fired.",
    linkedin:
      "\u{1F680} Thrilled to announce that after deep reflection, I've made the bold decision to pursue new opportunities. Sometimes the universe closes a door to open a WAREHOUSE. This isn't an ending \u2014 it's a masterclass in resilience. To my former team: you didn't just give me a job. You gave me a STORY. \u{1F64F}\n\n#OpenToWork #Disruption #BlessedAndUnemployed",
  },
  {
    human: "I ate a sandwich for lunch.",
    linkedin:
      "Today I made a decision that changed everything.\n\nI chose nourishment. \u{1F96A}\n\nIn a world of back-to-back Zooms and notification overload, I paused. I was intentional. I committed to an artisanal bread experience layered with premium proteins.\n\nThe ROI? Immeasurable.\n\nLeaders don't skip meals. They INVEST in fuel. \u{1F525}\n\n#IntentionalLiving #ExecutiveWellness #SandwichLeadership",
  },
  {
    human: "I fixed a bug in the code.",
    linkedin:
      "6 months ago, I noticed something no one else did.\n\nA single line of code. Buried in legacy infrastructure. Silent. Dangerous.\n\nBut I'm not most people.\n\nAfter 47 hours of deep work, I deployed a fix that saved the company from CATASTROPHIC failure.\n\nThe lesson? Details matter. Character is built in the margins.\n\n\u{1F680} #Engineering #Leadership #HumbleBrag",
  },
  {
    human: "I went to a meeting.",
    linkedin:
      "Today I sat in a room with 11 brilliant humans.\n\nNo slides. No agenda. Just RAW COLLABORATION.\n\nWhat happened next gave me chills.\n\nWe ALIGNED. On vision. On values. On the path forward.\n\nGrateful doesn't even begin to cover it. \u{1F64F}\u2728\n\n#Teamwork #SynergyIsReal #MeetingsThatMatter",
  },
  {
    human: "My kid drew a picture.",
    linkedin:
      "My 4-year-old just taught me more about innovation than any TED Talk ever could.\n\nShe picked up a crayon. No brief. No stakeholder alignment.\n\nShe just CREATED.\n\nBe more like a 4-year-old. Ship fast. Color outside the lines. Eat the crayon if you have to.\n\n\u{1F680}\u{1F3A8} #Innovation #ParentingLeadership #CrayonEconomy",
  },
];

var REVERSE_EXAMPLES = [
  {
    linkedin:
      "Thrilled to announce I've joined an incredible team at [Company]! After a transformative journey of self-discovery, I'm ready to bring my unique perspective to this game-changing organization. #NewBeginnings #Grateful",
    human: "I got a new job.",
  },
  {
    linkedin:
      "I don't usually post about personal wins, but this one feels different. After months of grinding in silence, I'm proud to share that we hit our Q3 targets. None of this would be possible without my INCREDIBLE team. You know who you are.",
    human: "We did okay at work and I want people to know.",
  },
  {
    linkedin:
      "Unpopular opinion: Work-life balance is a myth. What you need is work-life INTEGRATION. I wake up at 4:30am not because I have to \u2014 but because I CHOOSE to invest in myself before the world wakes up. Your morning routine is your competitive advantage.",
    human: "I have no hobbies and I'm making it your problem.",
  },
];

var INTENSITIES = [
  { key: "light", name: "Light Bull", emoji: "\u{1F610}", desc: "A touch of polish" },
  { key: "standard", name: "Full Bull", emoji: "\u{1F680}", desc: "Rockets & humble brags" },
  {
    key: "extreme",
    name: "Weapons-Grade",
    emoji: "\u{1F9E0}\u{1F480}",
    desc: "You ARE the algorithm",
  },
];

var CATEGORIES = [
  { id: "hustle", label: "Hustle Culture", emoji: "\u{1F4AA}", color: "#e74c3c" },
  { id: "fitness", label: "Fitness Funnel", emoji: "\u{1F3CB}", color: "#27ae60" },
  { id: "vulnerability", label: "Performative Vulnerability", emoji: "\u{1F622}", color: "#8e44ad" },
  { id: "career", label: "Career Flex", emoji: "\u{1F4BC}", color: "#2980b9" },
  { id: "taught_me", label: "Here's What It Taught Me", emoji: "\u{1F4A1}", color: "#f39c12" },
  { id: "hiring", label: "Hiring As A Movement", emoji: "\u{1F680}", color: "#1abc9c" },
  { id: "unpopular", label: "Unpopular Popular Opinion", emoji: "\u{1F525}", color: "#e67e22" },
  { id: "meltdown", label: "Thought Leader Meltdown", emoji: "\u{1F9E0}", color: "#c0392b" },
  { id: "selling", label: "Selling Disguised As Sharing", emoji: "\u{1F3AF}", color: "#16a085" },
  { id: "other", label: "Other Corporate Delusion", emoji: "\u{1F921}", color: "#7f8c8d" },
];

var MAX_DAILY = 10;

/* ── Storage (localStorage for deployed version) ── */
function lsGet(key, fallback) {
  try {
    var v = localStorage.getItem("bs-" + key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, val) {
  try {
    localStorage.setItem("bs-" + key, JSON.stringify(val));
  } catch {}
}

function getWeekKey() {
  var d = new Date();
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var wk = Math.ceil(((d - jan1) / 864e5 + jan1.getDay() + 1) / 7);
  return d.getFullYear() + "-W" + wk;
}

function detectCategory(text) {
  var t = text.toLowerCase();
  if (/pound|lb|weight|body fat|coach|protocol|calori|gym|workout/i.test(t)) return "fitness";
  if (/4am|5am|grind|hustle|morning routine|never stop/i.test(t)) return "hustle";
  if (/vulnerable|vulnerability|scared to post|deep breath|crying|tears/i.test(t))
    return "vulnerability";
  if (/here's what.{0,30}taught|lesson|learned|takeaway/i.test(t)) return "taught_me";
  if (/hire|hiring|open role|join.{0,15}team/i.test(t)) return "hiring";
  if (/unpopular opinion/i.test(t)) return "unpopular";
  if (/free protocol|grab it|link below|dm me|lnkd/i.test(t)) return "selling";
  if (/thrilled|excited|promot|new role|joined/i.test(t)) return "career";
  if (/disrupting|4:47|moleskine|thought leader|davos/i.test(t)) return "meltdown";
  return "other";
}

/* ── Components ── */
function PostCard({ text }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e0ddd7",
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px 10px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          borderBottom: "1px solid #eceae5",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#e8f1fa,#d0e3f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {"\u{1F4BC}"}
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Thought Leader McInfluencer</div>
          <div style={{ fontSize: 11.5, color: "#8b8b8b" }}>
            CEO of Vibes {"\u00B7"} 2h
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "14px 18px 18px",
          fontSize: 14,
          color: "#4a4a4a",
          lineHeight: 1.75,
          whiteSpace: "pre-wrap",
          minHeight: 80,
          maxHeight: 340,
          overflowY: "auto",
        }}
      >
        {text}
      </div>
      <div
        style={{
          padding: "6px 18px 10px",
          borderTop: "1px solid #eceae5",
          display: "flex",
          gap: 20,
          fontSize: 12,
          color: "#8b8b8b",
          fontWeight: 500,
        }}
      >
        <span>{"\u{1F44D}"} Like</span>
        <span>{"\u{1F4AC}"} Comment</span>
        <span>{"\u{1F504}"} Repost</span>
      </div>
    </div>
  );
}

function ExampleSlider() {
  var [idx, setIdx] = useState(0);
  var ex = EXAMPLES[idx];
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 170px",
            minWidth: 160,
            background: "#fdf6ee",
            border: "1px solid #eddcc7",
            borderRadius: 10,
            padding: "16px 20px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: "#b5722a",
              marginBottom: 8,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            What you said
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>{ex.human}</div>
        </div>
        <div
          style={{
            flexShrink: 0,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#fff3e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#e65100",
            fontWeight: 700,
          }}
        >
          {"\u2192"}
        </div>
        <div style={{ flex: "2 1 300px", minWidth: 270 }}>
          <PostCard text={ex.linkedin} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: 16,
        }}
      >
        <button
          onClick={() => setIdx((i) => (i - 1 + EXAMPLES.length) % EXAMPLES.length)}
          style={navBtn}
        >
          {"\u2039"}
        </button>
        <div style={{ display: "flex", gap: 7 }}>
          {EXAMPLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: i === idx ? "#e65100" : "#e0ddd7",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all .25s",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx((i) => (i + 1) % EXAMPLES.length)}
          style={navBtn}
        >
          {"\u203A"}
        </button>
      </div>
    </div>
  );
}

function CatBadge({ id, small }) {
  var cat = CATEGORIES.find((c) => c.id === id) || CATEGORIES[9];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: small ? "2px 8px" : "4px 12px",
        borderRadius: 12,
        background: cat.color + "15",
        border: "1px solid " + cat.color + "30",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        color: cat.color,
      }}
    >
      {cat.emoji} {cat.label}
    </span>
  );
}

/* ── Walkthrough ── */
var WALK_STEPS = [
  {
    title: "Welcome to BullShift",
    emoji: "\u{1F4A9}",
    body: "The corporate-to-human translator the internet needed but nobody asked for. Here's a 30-second tour.",
    action: "Let's go",
  },
  {
    title: "Pick your direction",
    emoji: "\u{1F504}",
    body: 'Human \u2192 LinkedIn takes something normal ("I ate lunch") and inflates it into a thought leadership post.\n\nLinkedIn \u2192 Human does the opposite. Paste a real post, get what they actually meant.',
    action: "Got it",
  },
  {
    title: "Set the bull level",
    emoji: "\u{1F680}",
    body: "\u{1F610} Light Bull \u2014 a professional nudge.\n\n\u{1F680} Full Bull \u2014 rocket emojis, humble brags, hashtags.\n\n\u{1F9E0}\u{1F480} Weapons-Grade \u2014 you're crying in a Whole Foods parking lot about growth. This is art.",
    action: "Beautiful",
  },
  {
    title: "The Bull Pen",
    emoji: "\u{1F3C6}",
    body: "Found a wild LinkedIn post? Translate it, then submit it to the Bull Pen. Add your name. Tag it by category. 10 per day, community-curated.",
    action: "Almost done",
  },
  {
    title: "The Shift Report",
    emoji: "\u{1F4CA}",
    body: "Every translation is auto-tagged: Hustle Culture, Fitness Funnel, Performative Vulnerability, and more. The Shift Report tracks which type of bull is trending each week.",
    action: "Start shifting",
  },
];

function Walkthrough({ onDone }) {
  var [step, setStep] = useState(0);
  var s = WALK_STEPS[step];
  var isLast = step === WALK_STEPS.length - 1;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 28px 24px",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
          {WALK_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? "#e65100" : i < step ? "#ffab40" : "#e0ddd7",
                transition: "all .3s",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 48, textAlign: "center", marginBottom: 16 }}>{s.emoji}</div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {s.title}
        </h2>
        <div
          style={{
            fontSize: 14.5,
            color: "#4a4a4a",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {s.body}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: "9px 20px",
                borderRadius: 18,
                border: "1.5px solid #e0ddd7",
                background: "#fff",
                color: "#8b8b8b",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => (isLast ? onDone() : setStep(step + 1))}
            style={{
              padding: "10px 28px",
              borderRadius: 18,
              border: "none",
              background: "linear-gradient(135deg,#e65100,#ff8f00)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(230,81,0,0.25)",
            }}
          >
            {s.action}
          </button>
        </div>
        {!isLast && (
          <button
            onClick={onDone}
            style={{
              display: "block",
              margin: "16px auto 0",
              background: "none",
              border: "none",
              color: "#b5b5b5",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            skip tour
          </button>
        )}
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#ccc" }}>
          {step + 1} of {WALK_STEPS.length}
        </div>
      </div>
    </div>
  );
}

/* ── Submit Form ── */
function SubmitForm({ liText, huText, mode, onDone }) {
  var [name, setName] = useState("");
  var [cat, setCat] = useState("");
  var [busy, setBusy] = useState(false);
  var [msg, setMsg] = useState("");
  var [show, setShow] = useState(false);

  if (!show)
    return (
      <button
        onClick={() => setShow(true)}
        style={{ ...pill(false), fontSize: 13, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}
      >
        {"\u{1F3C6}"} Submit to the Bull Pen
      </button>
    );

  function go() {
    if (!cat) {
      setMsg("Pick a category first.");
      return;
    }
    setBusy(true);
    setMsg("");
    var today = new Date().toISOString().slice(0, 10);
    var dc = lsGet("dc-" + today, 0);
    if (dc >= MAX_DAILY) {
      setMsg("Daily limit reached (10/day). Come back tomorrow!");
      setBusy(false);
      return;
    }
    var subs = lsGet("subs", []);
    subs.unshift({
      linkedin: liText,
      human: huText,
      category: cat,
      name: name.trim() || "Anonymous Thought Leader",
      ts: Date.now(),
      mode: mode,
    });
    if (subs.length > 100) subs = subs.slice(0, 100);
    lsSet("subs", subs);
    lsSet("dc-" + today, dc + 1);
    // Track category
    var stats = lsGet("stats", {});
    var wk = getWeekKey();
    if (!stats[wk]) stats[wk] = {};
    stats[wk][cat] = (stats[wk][cat] || 0) + 1;
    lsSet("stats", stats);
    setMsg("You're in the Bull Pen. \u{1F525}");
    setBusy(false);
    if (onDone) onDone();
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0ddd7",
        borderRadius: 10,
        padding: "16px 20px",
        marginTop: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: "#e65100",
          marginBottom: 12,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {"\u{1F3C6}"} Submit to the Bull Pen
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#4a4a4a", marginBottom: 4 }}>
          Your name (for credit)
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anonymous Thought Leader"
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1.5px solid #e0ddd7",
            fontSize: 14,
            fontFamily: "inherit",
            background: "#fafaf8",
            outline: "none",
          }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#4a4a4a", marginBottom: 6 }}>
          Category
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 14,
                border: "1.5px solid " + (cat === c.id ? c.color : "#e0ddd7"),
                background: cat === c.id ? c.color + "15" : "#fff",
                color: cat === c.id ? c.color : "#666",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>
      {msg && (
        <div
          style={{
            fontSize: 13,
            color: msg.includes("Pen") ? "#27ae60" : "#e74c3c",
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          {msg}
        </div>
      )}
      <button
        onClick={go}
        disabled={busy}
        style={{
          background: "#e65100",
          color: "#fff",
          border: "none",
          padding: "9px 22px",
          borderRadius: 18,
          fontSize: 14,
          fontWeight: 600,
          cursor: busy ? "not-allowed" : "pointer",
          opacity: busy ? 0.5 : 1,
          fontFamily: "inherit",
        }}
      >
        {busy ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

/* ── Bull Pen ── */
function BullPen({ onTry }) {
  var subs = lsGet("subs", []);
  var [filt, setFilt] = useState("all");
  var filtered = filt === "all" ? subs : subs.filter((s) => s.category === filt);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>The Bull Pen</h2>
      <p style={{ color: "#8b8b8b", fontSize: 13.5, marginBottom: 14 }}>
        Community-submitted corporate delusion. {subs.length}/100 entries. 10 new per day.
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        <button
          onClick={() => setFilt("all")}
          style={{ ...pill(filt === "all"), fontSize: 12, padding: "5px 12px" }}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilt(c.id)}
            style={{ ...pill(filt === c.id), fontSize: 12, padding: "5px 12px" }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1.5px dashed #e0ddd7",
            borderRadius: 10,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 8 }}>{"\u{1F4A9}"}</div>
          <div style={{ fontSize: 14, color: "#b5b5b5" }}>
            {subs.length === 0
              ? "No submissions yet. Translate something, then submit the bull."
              : "Nothing in this category yet."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.slice(0, 20).map((entry, i) => (
            <div
              key={i}
              onClick={() => onTry(entry)}
              style={{
                background: "#fff",
                border: "1px solid #e0ddd7",
                borderRadius: 10,
                padding: "16px 20px",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <CatBadge id={entry.category} small />
                <span style={{ fontSize: 11, color: "#b5b5b5" }}>by {entry.name}</span>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 140px", minWidth: 120 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                      color: "#8b8b8b",
                      marginBottom: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {"\u{1F4BC}"} The Bull
                  </div>
                  <div style={{ fontSize: 13, color: "#4a4a4a", lineHeight: 1.5 }}>
                    {entry.linkedin.length > 140
                      ? entry.linkedin.slice(0, 140) + "..."
                      : entry.linkedin}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#e65100",
                    fontWeight: 700,
                  }}
                >
                  {"\u2192"}
                </div>
                <div style={{ flex: "1 1 140px", minWidth: 120 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                      color: "#b5722a",
                      marginBottom: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {"\u{1F9CD}"} The Shift
                  </div>
                  <div style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 600 }}>
                    {entry.human}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Shift Report ── */
function ShiftReport() {
  var stats = lsGet("stats", {});
  var wk = getWeekKey();
  var data = stats[wk] || {};
  var entries = CATEGORIES.map((c) => ({ cat: c, count: data[c.id] || 0 })).sort(
    (a, b) => b.count - a.count
  );
  var mx = Math.max(...entries.map((e) => e.count), 1);
  var total = entries.reduce((s, e) => s + e.count, 0);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>The Shift Report</h2>
      <p style={{ fontSize: 13, color: "#8b8b8b", marginBottom: 18 }}>
        {wk} {"\u00B7"} {total} translations tracked
      </p>
      {total === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1.5px dashed #e0ddd7",
            borderRadius: 10,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 8 }}>{"\u{1F4CA}"}</div>
          <div style={{ fontSize: 14, color: "#b5b5b5" }}>
            No shifts tracked yet this week. Translate something and this board populates
            automatically.
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e0ddd7",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: "#8b8b8b",
              marginBottom: 16,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Bull by category
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {entries
              .filter((e) => e.count > 0)
              .map((e, i) => {
                var pct = (e.count / mx) * 100;
                return (
                  <div key={e.cat.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 130,
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: "#4a4a4a",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {e.cat.emoji} {e.cat.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 26,
                        background: "#f0eee9",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: pct + "%",
                          height: "100%",
                          background: e.cat.color,
                          borderRadius: 6,
                          transition: "width .6s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 8,
                        }}
                      >
                        {pct > 15 && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
                            {e.count}
                          </span>
                        )}
                      </div>
                    </div>
                    {pct <= 15 && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#8b8b8b" }}>
                        {e.count}
                      </span>
                    )}
                    {i === 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: e.cat.color,
                          background: e.cat.color + "15",
                          padding: "2px 8px",
                          borderRadius: 8,
                        }}
                      >
                        #1
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {entries[0] && entries[0].count > 0 && (
        <div
          style={{
            background: "#fff3e0",
            border: "1px solid #ffe0b2",
            borderRadius: 10,
            padding: "16px 20px",
            marginTop: 16,
            fontSize: 14,
          }}
        >
          <strong>This week&apos;s top bull:</strong> {entries[0].cat.emoji}{" "}
          {entries[0].cat.label} with {entries[0].count} shifts (
          {total > 0 ? Math.round((entries[0].count / total) * 100) : 0}% of all traffic).
        </div>
      )}
    </div>
  );
}

/* ── Styles ── */
var navBtn = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "1.5px solid #e0ddd7",
  background: "#fff",
  color: "#4a4a4a",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "inherit",
};

function pill(on) {
  return {
    padding: "8px 16px",
    borderRadius: 18,
    border: "1.5px solid " + (on ? "#e65100" : "#e0ddd7"),
    background: on ? "#fff3e0" : "#fff",
    color: on ? "#e65100" : "#4a4a4a",
    fontSize: 14,
    fontWeight: on ? 600 : 500,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}

function chipStyle(on) {
  return {
    flex: 1,
    padding: "10px 6px",
    borderRadius: 10,
    border: "1.5px solid " + (on ? "#e65100" : "#e0ddd7"),
    background: on ? "#fff3e0" : "#fff",
    color: on ? "#e65100" : "#4a4a4a",
    fontSize: 12,
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "inherit",
  };
}

function tabStyle(on) {
  return {
    padding: "9px 16px",
    border: "none",
    background: "none",
    color: on ? "#e65100" : "#8b8b8b",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "2.5px solid " + (on ? "#e65100" : "transparent"),
    fontFamily: "inherit",
  };
}

/* ── Main App ── */
export default function Home() {
  var [mode, setMode] = useState("humanToLinkedin");
  var [intensity, setIntensity] = useState("standard");
  var [input, setInput] = useState("");
  var [output, setOutput] = useState("");
  var [loading, setLoading] = useState(false);
  var [copied, setCopied] = useState(false);
  var [activeTab, setActiveTab] = useState("translate");
  var [showTour, setShowTour] = useState(false);
  var [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    var toured = lsGet("toured", false);
    if (!toured) setShowTour(true);
  }, []);

  function dismissTour() {
    setShowTour(false);
    lsSet("toured", true);
  }

  var translate = useCallback(
    async function () {
      if (!input.trim()) return;
      setLoading(true);
      setOutput("");

      try {
        var res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input, mode: mode, intensity: intensity }),
        });
        var data = await res.json();
        if (data.error) {
          setOutput("Error: " + data.error);
        } else {
          setOutput(data.output || "No output.");
        }
      } catch (err) {
        setOutput("Connection error: " + err.message);
      }

      // Track category
      var cat = detectCategory(input);
      var stats = lsGet("stats", {});
      var wk = getWeekKey();
      if (!stats[wk]) stats[wk] = {};
      stats[wk][cat] = (stats[wk][cat] || 0) + 1;
      lsSet("stats", stats);
      setRefreshKey((k) => k + 1);

      setLoading(false);
    },
    [input, mode, intensity]
  );

  var handleCopy = function () {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  var tryEx = function (t) {
    setInput(t);
    setActiveTab("translate");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f2ee" }}>
      {showTour && <Walkthrough onDone={dismissTour} />}

      {/* Header */}
      <header
        style={{
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0ddd7",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg,#e65100,#ff8f00)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            BS
          </div>
          <span style={{ fontSize: 18, fontWeight: 800 }}>BullShift</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 11.5, color: "#8b8b8b", fontFamily: "'JetBrains Mono', monospace" }}>
            BS in {"\u2194"} truth out
          </div>
          <button
            onClick={() => setShowTour(true)}
            title="How it works"
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1.5px solid #e0ddd7",
              background: "#fff",
              color: "#8b8b8b",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit",
            }}
          >
            ?
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 18px" }}>
        {/* Hero */}
        <section style={{ padding: "36px 0 18px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "3px 14px",
              borderRadius: 14,
              background: "#fff3e0",
              border: "1px solid #ffe0b2",
              fontSize: 12.5,
              fontWeight: 600,
              color: "#e65100",
              marginBottom: 16,
            }}
          >
            shifting the bull since 2025
          </div>
          <h1
            style={{
              fontSize: "clamp(26px,4.5vw,40px)",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            Google Translate, but for
            <br />
            <span style={{ color: "#e65100" }}>corporate delusion</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#4a4a4a",
              maxWidth: 440,
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            Type something normal, get the LinkedIn version. Paste a LinkedIn post, get what
            they actually meant. No sign-up.
          </p>
          <ExampleSlider />
        </section>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1.5px solid #e0ddd7",
            marginBottom: 22,
            marginTop: 6,
          }}
        >
          {[
            ["translate", "Translate"],
            ["pen", "\u{1F4A9} Bull Pen"],
            ["report", "\u{1F4CA} Shift Report"],
          ].map(([id, label]) => (
            <button
              key={id}
              style={tabStyle(activeTab === id)}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "translate" && (
          <section>
            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <button
                style={pill(mode === "humanToLinkedin")}
                onClick={() => {
                  setMode("humanToLinkedin");
                  setOutput("");
                }}
              >
                {"\u{1F9CD}"} Human {"\u2192"} {"\u{1F4BC}"} LinkedIn
              </button>
              <button
                style={pill(mode === "linkedinToHuman")}
                onClick={() => {
                  setMode("linkedinToHuman");
                  setOutput("");
                }}
              >
                {"\u{1F4BC}"} LinkedIn {"\u2192"} {"\u{1F9CD}"} Human
              </button>
            </div>

            {/* Intensity */}
            {mode === "humanToLinkedin" && (
              <div style={{ display: "flex", gap: 7, marginBottom: 18, maxWidth: 480 }}>
                {INTENSITIES.map((it) => (
                  <button
                    key={it.key}
                    style={chipStyle(intensity === it.key)}
                    onClick={() => setIntensity(it.key)}
                  >
                    <div style={{ fontSize: 16 }}>{it.emoji}</div>
                    <div style={{ fontWeight: 600, fontSize: 11.5 }}>{it.name}</div>
                    <div style={{ fontSize: 10.5, color: "#8b8b8b", marginTop: 1 }}>
                      {it.desc}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Input + Output */}
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {/* Input side */}
              <div style={{ flex: 1, minWidth: 270 }}>
                <div
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e0ddd7",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 18px 4px",
                      fontSize: 10.5,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                      color: "#8b8b8b",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {mode === "humanToLinkedin"
                      ? "\u{1F9CD} Plain English"
                      : "\u{1F4BC} Paste the bull"}
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      mode === "humanToLinkedin"
                        ? 'e.g. "I went to a meeting."'
                        : "Paste a LinkedIn post here..."
                    }
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: "#1a1a1a",
                      fontSize: 15,
                      padding: "6px 18px 14px",
                      resize: "vertical",
                      lineHeight: 1.65,
                      minHeight: 140,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Quick examples */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 9,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12.5, color: "#8b8b8b" }}>Try:</span>
                  {mode === "humanToLinkedin"
                    ? ["I got fired.", "I ate lunch.", "I went to a meeting."].map((e) => (
                        <button
                          key={e}
                          onClick={() => tryEx(e)}
                          style={{
                            padding: "4px 11px",
                            borderRadius: 14,
                            border: "1px solid #e0ddd7",
                            background: "#fff",
                            color: "#4a4a4a",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {e}
                        </button>
                      ))
                    : REVERSE_EXAMPLES.map((e, i) => (
                        <button
                          key={i}
                          onClick={() => tryEx(e.linkedin)}
                          style={{
                            padding: "4px 11px",
                            borderRadius: 14,
                            border: "1px solid #e0ddd7",
                            background: "#fff",
                            color: "#4a4a4a",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.linkedin.slice(0, 35)}...
                        </button>
                      ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={translate}
                    disabled={loading || !input.trim()}
                    style={{
                      background: "#e65100",
                      color: "#fff",
                      border: "none",
                      padding: "11px 26px",
                      borderRadius: 22,
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                      opacity: loading || !input.trim() ? 0.45 : 1,
                      fontFamily: "inherit",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid rgba(255,255,255,.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spin .6s linear infinite",
                          }}
                        />
                        {mode === "humanToLinkedin" ? "Adding bull..." : "Shifting..."}
                      </>
                    ) : mode === "humanToLinkedin" ? (
                      "\u{1F680} Add the Bull"
                    ) : (
                      "\u{1F9E0} Shift the Bull"
                    )}
                  </button>
                </div>
              </div>

              {/* Output side */}
              <div style={{ flex: 1, minWidth: 270 }}>
                {output ? (
                  <>
                    {mode === "humanToLinkedin" ? (
                      <PostCard text={output} />
                    ) : (
                      <div
                        style={{
                          background: "#fdf6ee",
                          border: "1px solid #eddcc7",
                          borderRadius: 10,
                          padding: "18px 22px",
                          minHeight: 120,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 1.5,
                            color: "#b5722a",
                            marginBottom: 10,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {"\u{1F9CD}"} What they actually mean
                        </div>
                        <div style={{ fontSize: 17, lineHeight: 1.65, fontWeight: 500 }}>
                          {output}
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 9,
                      }}
                    >
                      <button
                        onClick={handleCopy}
                        style={{
                          padding: "5px 13px",
                          borderRadius: 14,
                          border: "1px solid #e0ddd7",
                          background: "#fff",
                          color: "#e65100",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {copied ? "\u2713 Copied!" : "\u{1F4CB} Copy"}
                      </button>
                    </div>
                    <SubmitForm
                      liText={mode === "humanToLinkedin" ? output : input}
                      huText={mode === "humanToLinkedin" ? input : output}
                      mode={mode}
                      onDone={() => setRefreshKey((k) => k + 1)}
                    />
                  </>
                ) : (
                  <div
                    style={{
                      background: "#fff",
                      border: "1.5px dashed #e0ddd7",
                      borderRadius: 10,
                      minHeight: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 6,
                      padding: 24,
                    }}
                  >
                    <div style={{ fontSize: 28, opacity: 0.25 }}>
                      {mode === "humanToLinkedin" ? "\u{1F4A9}" : "\u{1F9CD}"}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: "#b5b5b5",
                        textAlign: "center",
                      }}
                    >
                      {mode === "humanToLinkedin"
                        ? "The bull appears here"
                        : "The truth appears here"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "pen" && (
          <BullPen
            key={refreshKey}
            onTry={(entry) => {
              setMode("linkedinToHuman");
              setInput(entry.linkedin);
              setActiveTab("translate");
            }}
          />
        )}

        {activeTab === "report" && <ShiftReport key={refreshKey} />}

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "44px 0 24px",
            borderTop: "1px solid #e0ddd7",
            marginTop: 44,
          }}
        >
          <div style={{ fontSize: 13, color: "#8b8b8b", fontWeight: 500 }}>
            No sign-up. No tracking. No &quot;circle-backs.&quot; Just the shift.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              margin: "14px 0",
            }}
          >
            <a
              href="/privacy"
              style={{ fontSize: 12, color: "#8b8b8b", textDecoration: "none" }}
            >
              Privacy Policy
            </a>
            <span style={{ fontSize: 12, color: "#e0ddd7" }}>|</span>
            <a
              href="/terms"
              style={{ fontSize: 12, color: "#8b8b8b", textDecoration: "none" }}
            >
              Terms of Service
            </a>
          </div>
          <div style={{ fontSize: 11, color: "#b5b5b5" }}>
            &copy; 2025 BullShift. All rights reserved.
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: "#ccc",
              marginTop: 6,
              maxWidth: 440,
              margin: "6px auto 0",
            }}
          >
            Not affiliated with LinkedIn&reg; or Microsoft. Satire and commentary.
          </div>
        </footer>
      </div>
    </div>
  );
}