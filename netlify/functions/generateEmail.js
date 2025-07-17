const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    // Debug: Log environment and incoming body
    console.log("📨 Incoming Body:", event.body);
    console.log("🔐 Checking API Key presence:", !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OpenAI API key in server environment." }),
      };
    }

    // Parse prompt from body
    let prompt;
    try {
      const data = JSON.parse(event.body);
      prompt = data.prompt || "Say hello as a real estate agent.";
    } catch (parseErr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON in request body", details: parseErr.message }),
      };
    }

    console.log("🧠 Prompt to OpenAI:", prompt);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an elite real estate email writer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.data.choices[0].message.content;
    console.log("✅ OpenAI Response Received");

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error("🔥 OpenAI Error:", err.response?.data || err.message || err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "OpenAI request failed",
        message: err.message,
        details: err.response?.data || "No additional error details",
      }),
    };
  }
};
