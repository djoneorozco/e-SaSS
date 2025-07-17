// ==============================
// getHandler.js — Netlify Serverless Function
// ==============================

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const {
      purpose,
      audience,
      sassLevel,
      friendliness,
      psychology,
      business,
      insight,
      contextText,
      fileReference // Not used in this starter, but parsed
    } = data;

    // Craft dynamic system prompt based on sliders
    const systemPrompt = `You are an expert A.I. email assistant trained in psychology, business communication, and real estate. You will generate TWO versions of a ${purpose} email for a ${audience}. The tone should be set to SaSS level ${sassLevel}/10 and friendliness level ${friendliness}/10.

The message should include:
- Professional clarity and real estate domain knowledge
- Optional apology or persuasive structure based on context
- Subtle branding tone (not salesy)
- Respect the sliders: ${psychology}/10 Psychology Insight, ${business}/10 Business Logic, ${insight}/10 Explanation Depth

Context:
${contextText}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate both email options and an explanation." }
      ],
      model: "gpt-4o",
      temperature: 0.7
    });

    const output = completion.choices[0].message.content;

    // Split the output: assumes structure A, B, Insights
    const [optionA, optionB, explanation] = output.split(/Option B:|Insights?:/).map(s => s.trim());

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        optionA: optionA.replace(/^Option A:/, "").trim(),
        optionB: optionB.trim(),
        explanation: explanation.trim()
      })
    };

  } catch (err) {
    console.error("Handler error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

