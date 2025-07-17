// ================================
// # generateEmail.js — Netlify Function
// # OpenAI v4 | ESM Syntax | A+ Tested
// ================================

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt || "Say something insightful";

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are e-SaSS, an elite A.I. assistant trained in psychology, luxury real estate, business etiquette, and persuasive communication. Write TWO professionally crafted real estate emails using the parameters below. Your tone must reflect the sophistication of a Stanford MBA and a Harvard-trained real estate agent.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const aiText = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ result: aiText }),
    };
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenAI call failed", detail: err.message }),
    };
  }
}
