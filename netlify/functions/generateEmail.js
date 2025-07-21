// ==========================
// generateEmail.js (Node 18+, OpenAI v4+)
// ==========================
const OpenAI = require("openai");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt || "Write a professional email.";

    // Log the prompt for debugging
    console.log("PROMPT:", prompt);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert real estate assistant who writes perfect emails.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 700,
    });

    // Log the full completion for debugging
    console.log("COMPLETION:", completion);

    const message = completion.choices?.[0]?.message?.content;

    if (!message) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI returned an empty response." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: message }),
    };
  } catch (err) {
    console.error("🔥 OpenAI Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to generate email.",
        details: err.message,
      }),
    };
  }
};
