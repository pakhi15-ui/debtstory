import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { country, data } = await req.json();
  const prompt = `You are a world-class financial journalist. Write a compelling 3-sentence story about ${country}'s government debt history based on this data: ${JSON.stringify(data)}. Mention the highest and lowest points, and what drove the overall trend. Be dramatic but factual. No bullet points — flowing prose only.`;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    }),
  });
  const json = await res.json();
  const narration = json.choices?.[0]?.message?.content ?? 'No narration available.';
  return NextResponse.json({ narration });
}
