// ================================
// # generateEmail.js — Netlify Serverless Function
// ================================

const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Empty OpenAI response");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: data.choices[0].message.content }),
    };
  } catch (error) {
    console.error("🔥 OpenAI Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to generate email",
        detail: error.message,
      }),
    };
  }
};
