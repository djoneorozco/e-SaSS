// ================================
// # main.js — e-SaSS Premium SaaS v3.0
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

  // Fortune 500-level explanations (unchanged)
  function getPsychologyExplanation(level) { /* ...same as before... */ }
  function getBusinessExplanation(level) { /* ...same as before... */ }
  function getInsightExplanation(level) { /* ...same as before... */ }

  // Helper: Map slider values to actual instructions
  function sassToneInstruction(level) {
    // 1 = extremely casual/gossip, 10 = lawyer/formal
    if (level <= 2) return "Very casual, like texting a friend or fun gossip. Use friendly, approachable language.";
    if (level <= 4) return "Casual-professional, relaxed tone, like a familiar colleague.";
    if (level <= 7) return "Neutral-professional, balanced tone, businesslike but approachable.";
    if (level <= 9) return "Formal, like a high-level business email.";
    return "Extremely formal, polished, legal tone, as if written by an attorney for a Fortune 500 CEO.";
  }

  function emojiSlangInstruction(level) {
    // 0 = no emoji/slang, 10 = max emoji/slang (about 5 per email)
    if (level === 0) return "Do not use any emojis or slang/abbreviations.";
    if (level <= 2) return "Maybe 1 emoji, minimal slang.";
    if (level <= 4) return "Up to 2 emojis, occasional light slang.";
    if (level <= 7) return "Use up to 3 emojis, friendly abbreviations and a bit of modern slang where it fits.";
    if (level <= 9) return "Use up to 4 emojis and common slang/abbreviations (Insta, LOL, etc.) naturally.";
    return "Use up to 5 emojis, and plenty of playful slang and abbreviations throughout.";
  }

  function contextDepthInstruction(level) {
    // 1 = 50 words, 10 = 500 words (increments of 50)
    return `${level * 50}`;
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
    progress.innerText = "Generating your Fortune 500 email...";

    // Gather Form Data
    const formData = new FormData(form);
    const purpose = formData.get("purpose");
    const audience = formData.get("audience");
    const sassLevel = parseInt(formData.get("sassLevel"));
    const contextDepth = parseInt(formData.get("contextDepth"));
    const emojiSlang = parseInt(formData.get("emojiSlang"));
    const background = formData.get("background")?.trim();
    const file = formData.get("upload");

    // Lenses
    const useLenses = formData.get("lensToggle") === "on";
    const psychology = useLenses ? parseInt(formData.get("psychology")) : null;
    const business = useLenses ? parseInt(formData.get("business")) : null;
    const technical = useLenses ? parseInt(formData.get("technical")) : null;

    // Validation
    if (!purpose || !audience) {
      progress.innerText = "Please complete required fields.";
      return;
    }

    // ====== Fortune 500 Premium Prompt Construction ======
    // Map sliders → explicit values
    const wordCount = contextDepthInstruction(contextDepth);
    const sassInstruction = sassToneInstruction(sassLevel);
    const emojiInstruction = emojiSlangInstruction(emojiSlang);

    let prompt = `
You are e-SaSS, a Fortune 500–quality AI writing coach for luxury real estate and business communications.

**TASK:** Write TWO distinct email drafts tailored for the scenario below. Each email must:
- Address this Purpose: ${purpose}
- For this Audience: ${audience}
- Use this Tone: ${sassInstruction}
- Approximate Length: ${wordCount} words
- Emoji/Slang Guidance: ${emojiInstruction}
- Base all content on this Context: "${background || "No scenario provided."}"
${file && file.name ? "- Also consider the uploaded file: " + file.name : ""}

**Guidelines:**
- Each draft should include a clear greeting, structured body, strong closing, and professional signature.
- Write at the sophistication of a top Ivy League real estate agent and a Stanford MBA.
- NO explicit mention of tone, word count, or emoji instructions—just embody them.
- Emails must be persuasive, credible, and high-conversion for real estate.
- Do not use meta notes or explanations inside the emails.

**After each email, add a short (2-sentence) breakdown in brackets, explaining the persuasion and communication technique (not visible to recipient).**
`;

    // LENS Controls (only visible in Lens Box)
    if (useLenses) {
      prompt += `
[INTERNAL: Lenses selected: Psychology ${psychology}/10, Business ${business}/10, Technical Insight ${technical}/10. These shape the underlying rationale, but DO NOT include these values in the email text.]
`;
    }

    // Ask for Fortune 500–quality
    prompt += `
**All writing should be indistinguishable from a Fortune 500 executive or Ivy League–trained real estate agent. Do not include explanations unless in the lens breakdown.**
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

      output.innerHTML = `<pre>${data.result}</pre>`;
      outputWrapper.style.display = "block";
      progress.innerText = "✨ Your Fortune 500 email is ready!";

      // Lens Explanations
      if (useLenses) {
        lensResults.innerHTML = `
          <div class="lens-title">Psychology Lens (${psychology}/10)</div>
          <div class="lens-explanation">${getPsychologyExplanation(psychology)}</div>
          <div class="lens-title">Business Lens (${business}/10)</div>
          <div class="lens-explanation">${getBusinessExplanation(business)}</div>
          <div class="lens-title">Insight Lens (${technical}/10)</div>
          <div class="lens-explanation">${getInsightExplanation(technical)}</div>
          <div style="margin-top:18px; font-size:12px; opacity:0.8;">
            <strong>AI received explicit instructions:</strong><br>
            <ul>
              <li>SaSS Tone: ${sassInstruction}</li>
              <li>Word Count: ${wordCount}</li>
              <li>Emoji/Slang: ${emojiInstruction}</li>
            </ul>
          </div>
        `;
        lensResults.style.display = "block";
      }

      // Fade in output
      form.classList.add("fade-out");
      setTimeout(() => {
        form.style.display = "none";
        outputWrapper.style.display = "block";
        outputWrapper.classList.add("fade-in");
        outputWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 280);

    } catch (error) {
      console.error("Error generating email:", error);
      progress.innerText = "❌ Failed to generate. Try again or check your connection.";
    }
  });
});
