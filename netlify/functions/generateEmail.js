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
    const prompt = body.prompt || "Write a professional email.";

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
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

    const message = completion.data.choices[0].message.content;

    if (!message) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI returned an empty response." }),
      };
    }

    // This is the key fix:
    return {
      statusCode: 200,
      body: JSON.stringify({ result: message }),
    };
  } catch (err) {
    console.error("🔥 OpenAI Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate email." }),
    };
  }
};
