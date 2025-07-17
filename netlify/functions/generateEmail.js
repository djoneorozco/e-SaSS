// ================================
// # generateEmail.js — Netlify Function
// # OpenAI v4 Integration | Ivy-Grade Quality
// ================================

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required" }),
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a luxury real estate email assistant named e-SaSS. You write two polished marketing emails based on input tone, purpose, and audience. Each is ~250 words and includes a persuasion strategy summary after.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiText = completion.choices[0]?.message?.content || "";

    return {
      statusCode: 200,
      body: JSON.stringify({ result: aiText }),
    };
  } catch (err) {
    console.error("OpenAI function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message }),
    };
  }
};
