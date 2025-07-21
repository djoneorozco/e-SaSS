// ==========================
// generateEmail.js
// ==========================
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body);

    // ✅ Extract values from request body
    const {
      purpose,
      target,
      tone = 5,
      context = "",
      emojiLevel = 0,
    } = body;

    // ✅ Validate context
    if (!context || context.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing context for email generation." }),
      };
    }

    // ✅ Construct prompt dynamically
    const prompt = `
You are an expert real estate communication assistant.

Write an email that fulfills the following criteria:
- Purpose: ${purpose}
- Audience: ${target}
- Tone (SaSS Level): ${tone} (1 = very formal, 10 = ultra-casual)
- Emoji/Slang Usage: ${emojiLevel} (0 = none, 10 = heavy)

Context to guide the message: ${context}

Write it clearly, professionally, and real-estate relevant. If emojiLevel is 0, avoid all emojis and slang.`;

    // ✅ Configure OpenAI
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert real estate assistant who writes clear, tone-matching emails.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 700,
    });

    const message = completion?.data?.choices?.[0]?.message?.content;

    if (!message) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI returned an empty response." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message }),
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
