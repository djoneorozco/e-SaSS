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

  // ========================================
  // Lens Explanations (Fortune 500 style)
  // ========================================
  function getPsychologyExplanation(level) {
    if (level <= 2) return "Psychology: Highly relatable, warm, and human—message feels like a peer or close friend, fostering instant trust and comfort.";
    if (level <= 4) return "Psychology: Balanced warmth and professionalism—shows friendly cues but also builds subtle credibility and trust triggers.";
    if (level <= 7) return "Psychology: Professional rapport—blends respectful distance with clear relationship-building and persuasive undertones.";
    if (level <= 9) return "Psychology: Executive presence—carefully managed emotion, status cues, and strategic warmth to influence high-value audiences.";
    return "Psychology: Elite-level persuasion—maximum trust, status, and urgency using advanced behavioral triggers seen in luxury sales.";
  }
  function getBusinessExplanation(level) {
    if (level <= 2) return "Business: Simple, direct value—minimal justification, focus on basic benefit or need.";
    if (level <= 4) return "Business: Adds clear value and ROI framing—shows recipient why the message is useful or profitable.";
    if (level <= 7) return "Business: Professional, MBA-style business case—uses subtle business logic, opportunity, and scarcity cues.";
    if (level <= 9) return "Business: Boardroom style—leverages exclusivity, competitive proof, and sophisticated profit logic.";
    return "Business: Fortune 500–grade strategy—delivers risk management, differentiation, and premium value in every sentence.";
  }
  function getInsightExplanation(level) {
    if (level <= 2) return "Insight: Quick takeaway—basic, actionable advice or insight with no jargon.";
    if (level <= 4) return "Insight: Credibility via data—drops in a relevant stat or proof to support points.";
    if (level <= 7) return "Insight: Targeted, relevant—uses local trends or a real example to strengthen the message.";
    if (level <= 9) return "Insight: Cites research or MBA logic—logic is always backed by strong rationale or best practices.";
    return "Insight: Research-grade—ties in academic/industry studies and frameworks for elite, premium trust.";
  }

  // ========================================
  // Slider Logic: Composite Value Mapping
  // ========================================
  function sassToneInstruction(level) {
    // 1 = extremely casual/gossip, 10 = lawyer/formal
    if (level <= 2) return "Extremely casual, warm, direct—like texting a friend. Uses open, transparent language and clear intent.";
    if (level <= 4) return "Casual-professional, with visible relationship warmth and honesty. Slightly informal and approachable.";
    if (level <= 7) return "Balanced business tone—respectful, moderately warm, with polite transparency. Suitable for standard client communication.";
    if (level <= 9) return "Highly professional, formal, measured. Subtle warmth but maintains corporate distance and strategic clarity.";
    return "Top-level formality, maximum diplomacy and polish, fully compliant with executive etiquette. No slang, emotionally reserved, legal-grade clarity.";
  }

  function contextDepthInstruction(level) {
    // 1 = 50 words (low detail/urgency/follow-up), 10 = 500 words (high detail/urgency/follow-up)
    if (level <= 2) return "50 words. Minimal context, very brief, no urgency or follow-up.";
    if (level <= 4) return "150 words. Short, simple, with a gentle request for follow-up only if needed.";
    if (level <= 7) return "300 words. Standard detail with clear next steps or light urgency cues—ask for a meeting if appropriate.";
    if (level <= 9) return "400 words. High detail, specific requests, urgent tone, and an explicit follow-up or meeting ask.";
    return "500 words. Maximum detail, full scenario, strong urgency, and very clear demand for prompt action or scheduled follow-up.";
  }

  function emojiSlangInstruction(level) {
    // 0 = no emoji/slang, 10 = max emoji/slang (about 5 per email)
    if (level === 0) return "No emojis or slang, strictly professional, zero expressiveness or special formatting.";
    if (level <= 2) return "1 emoji max, only where it feels natural. No abbreviations or slang. Tone stays formal.";
    if (level <= 4) return "Up to 2 emojis, occasional friendly expressions. Some light, business-appropriate abbreviations.";
    if (level <= 7) return "Up to 3 emojis, playful energy, some bold/italic formatting for emotional emphasis. Common abbreviations (Insta, LOL, etc.) are allowed.";
    if (level <= 9) return "Up to 4 emojis, frequent slang and abbreviations, highly expressive, and clear use of bold/italic for excitement or emotion.";
    return "Up to 5 emojis, maximum playful language, bold/italic phrases throughout, and heavy use of trending slang and abbreviations. Message feels energetic, relatable, and hyper-expressive.";
  }

  // ========================================
  // Main Form Submission: Prompt Engineering
  // ========================================
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

    // ==== Premium OpenAI Prompt Construction ====
    const wordCount = contextDepthInstruction(contextDepth);
    const sassInstruction = sassToneInstruction(sassLevel);
    const emojiInstruction = emojiSlangInstruction(emojiSlang);

    let prompt = `
You are e-SaSS, a Fortune 500–quality AI writing coach for luxury real estate and business communications.

**TASK:** Write TWO distinct email drafts tailored for the scenario below. Each email must:
- Address this Purpose: ${purpose}
- For this Audience: ${audience}
- Use this Tone: ${sassInstruction}
- Approximate Length: ${wordCount}
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

      // Lens Explanations (Only if toggled)
      if (useLenses) {
        lensResults.innerHTML = `
          <div class="lens-title">Psychology Lens (${psychology}/10)</div>
          <div class="lens-explanation">${getPsychologyExplanation(psychology)}</div>
          <div class="lens-title">Business Lens (${business}/10)</div>
          <div class="lens-explanation">${getBusinessExplanation(business)}</div>
          <div class="lens-title">Insight Lens (${technical}/10)</div>
          <div class="lens-explanation">${getInsightExplanation(technical)}</div>
          <div style="margin-top:18px; font-size:12px; opacity:0.8;">
            <strong>AI Instructions (for your insight):</strong><br>
            <ul>
              <li><b>SaSS Tone:</b> ${sassInstruction}</li>
              <li><b>Context Depth:</b> ${wordCount}</li>
              <li><b>Emoji/Slang:</b> ${emojiInstruction}</li>
            </ul>
            <span style="display:block;margin-top:8px;">These settings determined the style and persuasive logic in your emails above. Try different slider combos to see how your client relationships change!</span>
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
