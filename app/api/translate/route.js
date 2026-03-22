export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { text, mode, intensity } = body;
  if (!text || !mode) {
    return Response.json({ error: "Missing text or mode" }, { status: 400 });
  }

  const intensityGuide = {
    light:
      "mild professional polish, a few buzzwords, maybe one emoji, still recognizably human",
    standard:
      "full LinkedIn energy with rocket emojis, humble brags, short punchy paragraphs, gratitude performance, hashtags, the kind of post that makes you involuntarily roll your eyes",
    extreme:
      "MAXIMUM thought leader brain rot, every sentence is a paragraph, everything is a lesson, tears were shed, a child taught you about disruption, you are GRATEFUL and you need EVERYONE to know, absurd hashtags, multiple rocket emojis, so over-the-top it becomes art",
  };

  const prompt =
    mode === "humanToLinkedin"
      ? "You are a satirical LinkedIn post generator. Transform the user's plain text into a LinkedIn post.\n\nIntensity: " +
        (intensityGuide[intensity] || intensityGuide.standard) +
        "\n\nOutput ONLY the LinkedIn post. No preamble, no explanation, no quotes around it.\n\nText: \"" +
        text +
        "\""
      : "You are a brutally honest translator that converts LinkedIn posts back into what the person actually means. Write in first person as the poster being honest. Strip away ALL corporate jargon, humble-bragging, inspirational framing, and performative gratitude. Return the raw, honest, usually mundane truth underneath. Be funny but accurate. Keep it short — usually 1-3 sentences max.\n\nOutput ONLY the honest translation. No preamble.\n\nLinkedIn post: \"" +
        text +
        "\"";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return Response.json(
        { error: data.error.message || "API error" },
        { status: 502 }
      );
    }

    const output = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return Response.json({ output });
  } catch (err) {
    return Response.json(
      { error: "Failed to reach API: " + err.message },
      { status: 502 }
    );
  }
}