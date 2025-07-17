// ================================
// # main.js — e-SaSS V2 Logic Engine
// # Fortune 500 | Ivy League Quality
// ================================

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eSaSSForm");
  const outputWrapper = document.getElementById("outputWrapper");
  const output = document.getElementById("emailOutput");
  const progress = document.getElementById("progress");
  const lensToggle = document.getElementById("lensToggle");
  const lensResults = document.getElementById("lensResults");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    output.innerHTML = "";
    lensResults.innerHTML = "";
    outputWrapper.style.display = "none";
    progress.innerText = "Generating email magic... 🧠💬";

    // ========================
    // #1: Gather Form Data
    // ========================
    const formData = new FormData(form);
    const purpose = formData.get("purpose");
    const audience = formData.get("audience");
    const sassLevel = parseInt(formData.get("sassLevel"));
    const contextDepth = parseInt(formData.get("contextDepth"));
    const emojiSlang = parseInt(formData.get("emojiSlang"));
    const background = formData.get("background")?.trim();
    const file = formData.get("upload");

    // Lens Depth (if enabled)
    const useLenses = formData.get("lensToggle") === "on";
    const psychology = useLenses ? parseInt(formData.get("psychology")) : null;
    const business = useLenses ? parseInt(formData.get("business")) : null;
    const technical = useLenses ? parseInt(formData.get("technical")) : null;

    // Basic Validation
    if (!purpose || !audience) {
      progress.innerText = "Please complete required fields.";
      return;
    }

    // ========================
    // #2: Construct Prompt
    // ========================
    let prompt = `
You are e-SaSS, an elite A.I. assistant trained in psychology, luxury real estate, business etiquette, and persuasive communication. Write TWO professionally crafted real estate emails using the parameters below. Your tone must reflect the sophistication of a Stanford MBA and a Harvard-trained real estate agent.

Message Purpose: ${purpose}
Recipient Type: ${audience}
Tone (SaSS Level): ${sassLevel}/10
Context Depth: ${contextDepth}/10
Emoji/Slang Usage: ${emojiSlang}/10
Context Provided: ${background || "No summary provided."}
`;

    if (file && file.name) {
      prompt += `\nFile Uploaded: ${file.name}`;
    }

    if (useLenses) {
      prompt += `
Psychology Lens: ${psychology}/10
Business Lens: ${business}/10
Insight Depth: ${technical}/10
`;
    }

    prompt += `
Generate:
- Two distinct email scripts (under 500 words each)
- Each should include a compelling tone and tailored strategy
- Below each email, add a short breakdown explaining the writing style or persuasion logic
- Write with clarity, empathy, authority, and polish
`;

    // ========================
    // #3: Call OpenAI Function
    // ========================
    try {
      const response = await fetch("/.netlify/functions/generateEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!data || !data.result) throw new Error("Empty OpenAI response");

      // ========================
      // #4: Render Output
      // ========================
      output.innerHTML = `<pre>${data.result}</pre>`;
      outputWrapper.style.display = "block";
      progress.innerText = "✨ Your smart email is ready!`;

      if (useLenses) {
        lensResults.innerHTML = `
          <div class="lens-breakdown">
            <h4>Lens Analysis (for reference only)</h4>
            <ul>
              <li>🧠 Psychology: ${psychology}/10</li>
              <li>💼 Business: ${business}/10</li>
              <li>🛠️ Insight: ${technical}/10</li>
            </ul>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error generating email:", error);
      progress.innerText = "❌ Failed to generate. Try again.";
    }
  });
});
