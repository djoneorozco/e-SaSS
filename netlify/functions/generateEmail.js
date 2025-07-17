// ================================
// # generateEmail.js — Netlify Function Debug
// ================================
const { Configuration, OpenAIApi } = require("openai");

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

    console.log("🧠 Received prompt:", prompt);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ No OpenAI API key found in environment!");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI API key missing" }),
      };
    }

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
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

    console.log("✅ OpenAI raw response:", completion.data);

    const aiText = completion.data.choices[0]?.message?.content || "";

    if (!aiText) {
      throw new Error("OpenAI returned an empty message content");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: aiText }),
    };
  } catch (err) {
    console.error("❌ OpenAI function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message }),
    };
  }
};
