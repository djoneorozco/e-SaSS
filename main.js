// ================================
// # main.js — e-SaSS V2.99 Dynamic Lens Engine
// # Fortune 500 | Ivy League Quality
// ================================

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eSaSSForm");
  const outputWrapper = document.getElementById("outputWrapper");
  const output = document.getElementById("emailOutput");
  const progress = document.getElementById("progress");
  const lensToggle = document.getElementById("lensToggle");
  const lensControls = document.getElementById("lensControls");
  const lensResults = document.getElementById("lensResults");

  // Show/hide lens depth controls
  lensToggle.addEventListener('change', function () {
    lensControls.style.display = this.checked ? 'block' : 'none';
  });

  // ========================
  // #1: Dynamic Lens Explanation Generators
  // ========================
  function getPsychologyExplanation(level) {
    if (level <= 2) return "Adds a friendly, approachable tone with light emoji/slang to build human connection.";
    if (level <= 4) return "Balances professionalism and warmth, using emotional triggers like curiosity, safety, or subtle status cues.";
    if (level <= 6) return "Applies subtle trust, urgency, and exclusivity cues to nudge the recipient toward action.";
    if (level <= 8) return "Incorporates FOMO, strong trust signals, and aspirational language to drive stronger responses.";
    return "Leverages advanced buyer psychology: framing, FOMO, social proof, status, and impulse triggers—just like luxury marketing and high-ticket sales strategies.";
  }

  function getBusinessExplanation(level) {
    if (level <= 2) return "Focuses on clear details, basic value delivery, and simple business justifications.";
    if (level <= 4) return "Adds logical benefits and reasons for action, lightly appealing to ROI and practical value.";
    if (level <= 6) return "Integrates ROI framing, business positioning, and subtle premium cues for professional impact.";
    if (level <= 8) return "Uses MBA-level framing: cost/benefit, scarcity, competitive proof, and high-value justification.";
    return "Applies boardroom-grade business strategy—unique value framing, risk-proofing, and profit logic, all justified like a top consulting memo.";
  }

  function getInsightExplanation(level) {
    if (level <= 2) return "Offers a simple, practical insight—no technical jargon, just what matters most.";
    if (level <= 4) return "Blends in a few data-backed statements or references to build extra credibility.";
    if (level <= 6) return "Brings in targeted insight: current stats, real case examples, or local market trends.";
    if (level <= 8) return "Explains the logic with MBA/PhD-level insight, including industry research and actionable examples.";
    return "Delivers research-grade, reference-backed rationale: academic findings, market studies, and proven frameworks, all tailored to your message.";
  }

  // ========================
  // #2: Main Form Submission
  // ========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    output.innerHTML = "";
    lensResults.innerHTML = "";
    outputWrapper.style.display = "none";
    lensResults.style.display = "none";
    progress.innerText = "Generating email magic... 🧠💬";

    // # Gather Form Data
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

    // # Basic Validation
    if (!purpose || !audience) {
      progress.innerText = "Please complete required fields.";
      return;
    }

    // # Construct Prompt for OpenAI
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

    // # Call OpenAI Function
    try {
      const response = await fetch("/.netlify/functions/generateEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (!data || !data.result) throw new Error("Empty OpenAI response");

      // # Render Output
      output.innerHTML = `<pre>${data.result}</pre>`;
      outputWrapper.style.display = "block";
      progress.innerText = "✨ Your smart email is ready!";

      // # Render Dynamic Lens Explanations (if enabled)
      if (useLenses) {
        lensResults.innerHTML = `
          <div class="lens-title">Psychology Lens (${psychology}/10)</div>
          <div class="lens-explanation">${getPsychologyExplanation(psychology)}</div>
          <div class="lens-title">Business Lens (${business}/10)</div>
          <div class="lens-explanation">${getBusinessExplanation(business)}</div>
          <div class="lens-title">Insight Lens (${technical}/10)</div>
          <div class="lens-explanation">${getInsightExplanation(technical)}</div>
        `;
        lensResults.style.display = "block";
      }
    } catch (error) {
      console.error("Error generating email:", error);
      progress.innerText = "❌ Failed to generate. Try again.";
    }
  });
});
