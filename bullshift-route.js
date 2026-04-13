export async function POST(req) {
  const { text, mode } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ result: "ANTHROPIC_API_KEY not configured. Add it in Vercel → Settings → Environment Variables." }, { status: 500 });
  }

  const systemPrompt = mode === "humanToLinkedin"
    ? `You are a LinkedIn post generator. Take a simple, honest human statement and transform it into an over-the-top, jargon-filled LinkedIn post. Use buzzwords like "synergy," "thought leadership," "circle back," "leverage," "stakeholder alignment," etc. Add performative gratitude, humble brags, and unnecessary lessons. Make it 2-4 paragraphs. Include hashtags. Be satirical but realistic — it should read like a real LinkedIn post. Do NOT include any preamble or explanation. Just output the LinkedIn post.`
    : `You are a corporate jargon translator. Take a LinkedIn post full of buzzwords, humble brags, and performative language, and translate it into what the person actually means in plain, honest English. Be direct, funny, and brutally honest. Keep it concise — usually 1-3 sentences. Do NOT include any preamble or explanation. Just output the honest translation.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          { role: "user", content: text },
        ],
        system: systemPrompt,
      }),
    });

    const data = await res.json();

    if (data.error) {
      return Response.json({ result: `API error: ${data.error.message}` }, { status: 500 });
    }

    const result = data.content?.[0]?.text || "Translation failed. The bull won this round.";
    return Response.json({ result });
  } catch (err) {
    return Response.json({ result: "Something broke. Even the bull couldn't save this one." }, { status: 500 });
  }
}
