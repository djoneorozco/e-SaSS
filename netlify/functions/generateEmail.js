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
        body: JSON.stringify({ error: "No prompt provided" }),
      };
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4", // You can change this to "gpt-3.5-turbo" if needed
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
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
    console.error("OpenAI Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate response", details: err.message }),
    };
  }
};
