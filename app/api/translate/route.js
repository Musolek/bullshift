import Anthropic from "@anthropic-ai/sdk";

// ─── In-memory rate limiter (resets on cold start, good enough for serverless) ───
const rateLimitMap = new Map();
const RATE_LIMIT    = 20;   // max requests per window per IP
const RATE_WINDOW   = 60_000; // 1 minute window

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - record.start > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;

  record.count++;
  rateLimitMap.set(ip, record);
  return true;
}

// Clean up old entries periodically (prevents unbounded memory growth)
setInterval(() => {
  const cutoff = Date.now() - RATE_WINDOW;
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.start < cutoff) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

// ─── Tone prompts ─────────────────────────────────────────────────────────────
const TONE_GUIDES = {
  Diplomatic:  "Charitable and gentle, but unflinchingly honest. Give the author reasonable benefit of the doubt.",
  Measured:    "Clear and direct. Some warmth. No snark.",
  Balanced:    "Neutral. Crisp. No padding. No editorial opinion.",
  Blunt:       "Terse. Says exactly what it means. Zero decoration.",
  Obliterate:  "Surgical. Occasionally withering, never cruel. The wit serves the truth.",
};

const SYSTEM_PROMPT = (tone) => `You are BullShift — a sharp editorial voice that translates corporate LinkedIn jargon into plain, honest English.

Tone: ${tone}
Guidance: ${TONE_GUIDES[tone] || TONE_GUIDES["Balanced"]}

Respond ONLY with a valid JSON object. No markdown. No preamble. No trailing text.

{
  "translation": "The plain-English version. Preserve the actual meaning. Mix sentence lengths — rhythm matters.",
  "score": 72,
  "jargon": ["specific phrase", "another one"],
  "note": "One dry, sharp editorial observation. Omit if you'd be reaching."
}

Rules:
- score: integer 0–100 (jargon density + communication opacity)
- jargon: exact phrases from the source, max 8
- translation: sounds like a real human, not a robot simplifying
- note: illuminates, doesn't mock. Omit the field entirely if there's nothing worth saying.
- Return ONLY the JSON object.`;

// ─── Handler ─────────────────────────────────────────────────────────────────
export async function POST(req) {
  // Rate limit check
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many requests. Slow down — the jargon will still be there." },
      { status: 429 }
    );
  }

  // Parse + validate body
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { text, tone = "Balanced" } = body;

  if (!text?.trim()) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }
  if (text.length > 2000) {
    return Response.json({ error: "Text too long. 2000 characters max." }, { status: 400 });
  }
  if (!TONE_GUIDES[tone]) {
    return Response.json({ error: "Invalid tone." }, { status: 400 });
  }

  // Anthropic call
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    return Response.json({ error: "Service misconfigured." }, { status: 500 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      system: SYSTEM_PROMPT(tone),
      messages: [{ role: "user", content: text.trim() }],
    });

    const raw = response.content?.[0]?.text || "";

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      // Graceful fallback if model doesn't return clean JSON
      parsed = { translation: raw, score: 50, jargon: [], note: "" };
    }

    // Sanitize output
    return Response.json({
      translation: String(parsed.translation || "").slice(0, 2000),
      score:       Math.max(0, Math.min(100, parseInt(parsed.score) || 50)),
      jargon:      Array.isArray(parsed.jargon) ? parsed.jargon.slice(0, 8).map(String) : [],
      note:        parsed.note ? String(parsed.note).slice(0, 300) : "",
    });
  } catch (err) {
    console.error("Anthropic error:", err?.message || err);
    return Response.json(
      { error: "Translation failed. The jargon wins this round." },
      { status: 500 }
    );
  }
}
