// ================================
// # generateEmail.js — Netlify Function (Fixed)
// # Handles prompt errors, OpenAI fails, and JSON crashes
// ================================

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const body = JSON.parse(event.body);
    const prompt = body.prompt;

    // ✅ TEST SHORTCUT
    if (prompt === "TEST_FUNCTION") {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: "✅ Function reached server and returned JSON." }),
      };
    }

    if (!prompt || prompt.length < 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt too short or missing." }),
      };
    }

    console.log("🧠 Incoming prompt:", prompt);

    // ✅ OpenAI API Call
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are e-SaSS, an elite A.I. assistant trained in psychology, luxury real estate, business etiquette, and persuasive communication. Write TWO professionally crafted real estate emails using the parameters below. Your tone must reflect the sophistication of a Stanford MBA and a Harvard-trained real estate agent.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const aiText = completion.choices?.[0]?.message?.content;

    if (!aiText || aiText.trim() === "") {
      console.error("❌ Empty OpenAI response");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI returned empty content." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: aiText }),
    };
  } catch (err) {
    console.error("🔥 Function crash:", err.message);

    // ✅ Still return valid JSON so the frontend won't crash
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        detail: err.message || "Unknown server error",
      }),
    };
  }
}
