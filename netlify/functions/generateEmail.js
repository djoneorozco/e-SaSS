// ================================
// # generateEmail.js — Netlify Function
// # e-SaSS V2 | OpenAI Handler
// ================================

const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
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
        body: JSON.stringify({ error: "Missing prompt in request body" }),
      };
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4", // you can change to gpt-3.5-turbo if needed
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const result = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error("🔥 OpenAI ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenAI request failed", details: err.message }),
    };
  }
};
