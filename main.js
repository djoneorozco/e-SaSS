// ================================
// # main.js — e-SaSS V2.99 Dynamic Lens Engine (Fortune 500 | Ivy League Quality)
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
  // #Fading Function
  // ========================
  function fadeToOutput() {
    form.classList.add("fade-out");
    setTimeout(() => {
      form.style.display = "none";
      outputWrapper.style.display = "block";
      outputWrapper.classList.add("fade-in");
      outputWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 280);
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

    // # Calculate max word count
    const wordCount = contextDepth * 50; // 1=50, 10=500

    // # Compose emoji/slang instructions
    let emojiInstruction = "";
    let slangInstruction = "";
    if (emojiSlang === 0) {
      emojiInstruction = "Do NOT use any emojis in the email.";
      slangInstruction = "Do NOT use any slang, abbreviations, or misspellings.";
    } else {
      emojiInstruction = `Use up to ${Math.round(emojiSlang * 0.5)} emojis, spaced naturally in the email.`; // 10=5 emojis
      slangInstruction = emojiSlang < 4
        ? "Use very little or no slang or abbreviations."
        : emojiSlang < 7
        ? "Use some casual phrasing and a few modern terms, but stay professional."
        : "Use a strong amount of friendly slang, modern abbreviations, and casual phrases."
    }

    // # Tone
    let toneInstruction = "";
    if (sassLevel >= 8) {
      toneInstruction = "The tone must be extremely formal, direct, and polished, as if written by a lawyer or for a boardroom audience.";
    } else if (sassLevel >= 6) {
      toneInstruction = "The tone should be professional, polished, and businesslike, but not stiff.";
    } else if (sassLevel >= 4) {
      toneInstruction = "Use a balanced tone: friendly, warm, and approachable while maintaining professionalism.";
    } else if (sassLevel >= 2) {
      toneInstruction = "Use a casual, upbeat, and conversational tone as if writing to a friend or favorite client.";
    } else {
      toneInstruction = "Write as if you are chatting with a close friend; use gossip, banter, and maximum warmth.";
    }

    // # Compose Prompt for OpenAI
    let prompt = `
You are e-SaSS, a Fortune 500-level A.I. assistant for realtors. Write TWO real estate email scripts based on the sliders below. Each script should reflect the desired tone, length, and emoji/slang level — and be tailored to the user's input.

Sliders Chosen:
- SaSS Level (Tone): ${sassLevel}/10 (${toneInstruction})
- Context Depth: ${contextDepth}/10 (Word Count Target: ${wordCount})
- Emoji/Slang Level: ${emojiSlang}/10 (${emojiInstruction} ${slangInstruction})

Additional Context:
- Purpose: ${purpose}
- Audience: ${audience}
- Scenario: ${background || "No summary provided."}
${file && file.name ? "- File uploaded: " + file.name : ""}

== Instructions for e-SaSS AI ==
1. STRICTLY limit each email to about ${wordCount} words (±10% is okay).
2. For emoji/slang: Emoji: ${emojiSlang}/10. Slang: ${emojiSlang}/10. ${emojiInstruction} ${slangInstruction}
3. For tone: SaSS Level ${sassLevel}/10. ${toneInstruction}
4. Do NOT explain the slider choices in the email output.
5. Return ONLY the emails.
6. Each script must be different (e.g., approach, hook, closing).
`;

    if (useLenses) {
      prompt += `
(For reference, the user has also enabled these additional communication 'lenses': 
Psychology Lens: ${psychology}/10, Business Lens: ${business}/10, Insight Depth: ${technical}/10)
`;
    }

    // Add generation instructions at the end
    prompt += `
Write TWO emails, separated clearly.
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
          <div class="lens-title">e-SaSS Smart Insights</div>
          <div style="margin-bottom:16px;">
            <b>SaSS Level (Tone):</b> ${sassLevel}/10<br>
            <b>Context Depth:</b> ${contextDepth}/10 (${wordCount} words)<br>
            <b>Emoji/Slang:</b> ${emojiSlang}/10
          </div>
          <div class="lens-title">Psychology Lens (${psychology}/10)</div>
          <div class="lens-explanation">${getPsychologyExplanation(psychology)}</div>
          <div class="lens-title">Business Lens (${business}/10)</div>
          <div class="lens-explanation">${getBusinessExplanation(business)}</div>
          <div class="lens-title">Insight Lens (${technical}/10)</div>
          <div class="lens-explanation">${getInsightExplanation(technical)}</div>
        `;
        lensResults.style.display = "block";
      }

      // ===========================
      // FADE TO OUTPUT (only change here!)
      // ===========================
      fadeToOutput();

    } catch (error) {
      console.error("Error generating email:", error);
      progress.innerText = "❌ Failed to generate. Try again.";
    }
  });
});
