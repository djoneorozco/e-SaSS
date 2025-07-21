// ================================
// # main.js — e-SaSS Ultra v3.0
// # Fortune 500 | Ivy League Quality | Glassmorphism Engine
// ================================

window.addEventListener("DOMContentLoaded", () => {
  //#1: ELEMENTS
  const form = document.getElementById("eSaSSForm");
  const outputWrapper = document.getElementById("outputWrapper");
  const output = document.getElementById("emailOutput");
  const progress = document.getElementById("progress");
  const lensToggle = document.getElementById("lensToggle");
  const lensControls = document.getElementById("lensControls");
  const lensResults = document.getElementById("lensResults");
  const lensContent = document.getElementById("lensContent");
  const copyBtn = document.getElementById("copyBtn");
  const returnBtn = document.getElementById("returnBtn");

  //#2: INIT — Always show only form on load
  outputWrapper.style.display = "none";
  lensResults.style.display = "none";
  form.classList.add("fade-in", "show");
  outputWrapper.classList.remove("show");
  lensResults.classList.remove("show");

  //#3: DARK MODE — sticky across reloads (localStorage)
  const themeToggle = document.getElementById('themeToggle');
  if (localStorage.getItem('eSaSS_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  }
  themeToggle.addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('eSaSS_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  //#4: LENS DEPTH CONTROLS — show/hide logic
  lensToggle.addEventListener('change', function () {
    lensControls.style.display = this.checked ? 'block' : 'none';
  });

  //#5: TRANSITION HANDLER
  function fadeOut(element) {
    element.classList.remove("show");
    element.classList.add("hide");
    setTimeout(() => { element.style.display = "none"; }, 250);
  }
  function fadeIn(element) {
    element.style.display = "block";
    setTimeout(() => {
      element.classList.remove("hide");
      element.classList.add("show");
    }, 10);
  }

  //#6: OUTPUT/RETURN BUTTON HANDLER
  function showOutputView() {
    fadeOut(form);
    setTimeout(() => {
      fadeIn(outputWrapper);
      // Only show lens box if enabled
      if (lensToggle.checked) {
        fadeIn(lensResults);
      }
      // Scroll to output card smoothly
      setTimeout(() => {
        document.getElementById("outputWrapper").scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }, 250);
  }
  function showFormView() {
    fadeOut(outputWrapper);
    fadeOut(lensResults);
    setTimeout(() => {
      fadeIn(form);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
    // Reset progress, output, lens content
    setTimeout(() => {
      progress.innerText = "";
      output.innerHTML = "";
      lensContent.innerHTML = "";
    }, 400);
  }

  returnBtn.addEventListener("click", showFormView);

  //#7: FORM SUBMIT — AI GENERATION + TRANSITIONS
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    output.innerHTML = "";
    lensContent.innerHTML = "";
    progress.innerText = "Generating email magic... 🧠💬";
    // Show loader for immediate feedback
    outputWrapper.style.display = "none";
    lensResults.style.display = "none";

    //#7a: Gather Form Data
    const formData = new FormData(form);
    const purpose = formData.get("purpose");
    const audience = formData.get("audience");
    const sassLevel = parseInt(formData.get("sassLevel"));
    const contextDepth = parseInt(formData.get("contextDepth"));
    const emojiSlang = parseInt(formData.get("emojiSlang"));
    const background = formData.get("background")?.trim();
    const file = formData.get("upload");
    const useLenses = lensToggle.checked;
    const psychology = useLenses ? parseInt(formData.get("psychology")) : null;
    const business = useLenses ? parseInt(formData.get("business")) : null;
    const technical = useLenses ? parseInt(formData.get("technical")) : null;

    //#7b: Validate Required
    if (!purpose || !audience) {
      progress.innerText = "Please complete required fields.";
      return;
    }

    //#7c: Build OpenAI Prompt
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

    //#7d: Call OpenAI Backend
    try {
      const response = await fetch("/.netlify/functions/generateEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (!data || !data.result) throw new Error("Empty OpenAI response");

      // Render output and fade in, hide form
      output.innerHTML = `<pre>${data.result}</pre>`;
      progress.innerText = "✨ Your smart email is ready!";
      showOutputView();

      // If Lens enabled, render AI lens insights
      if (useLenses) {
        // Here you can add a "supreme A+" lens breakdown (or let OpenAI return this as part of the result if you wish)
        lensResults.style.display = "block";
        lensContent.innerHTML = `
          <div class="lens-title">Psychology Lens (${psychology}/10)</div>
          <div class="lens-explanation">${getPsychologyExplanation(psychology)}</div>
          <div class="lens-title">Business Lens (${business}/10)</div>
          <div class="lens-explanation">${getBusinessExplanation(business)}</div>
          <div class="lens-title">Insight Lens (${technical}/10)</div>
          <div class="lens-explanation">${getInsightExplanation(technical)}</div>
        `;
      } else {
        lensResults.style.display = "none";
      }
    } catch (error) {
      console.error("Error generating email:", error);
      progress.innerText = "❌ Failed to generate. Try again.";
      showFormView();
    }
  });

  //#8: COPY BUTTON — keeps gold flash, built-in in HTML via index
  // (function in index.html, no changes needed here)

  //#9: AI LENS EXPLANATION LOGIC (tiered by slider)
  function getPsychologyExplanation(level) {
    if (level <= 2) return "Adds a friendly tone, light emoji/slang for simple human connection.";
    if (level <= 4) return "Balances authority with some emotional triggers (curiosity, safety, or status).";
    if (level <= 6) return "Uses subtle trust, urgency, and exclusivity cues to shape buyer/seller action.";
    if (level <= 8) return "Incorporates FOMO, deep trust signals, aspirational language to drive response.";
    return "Leverages advanced buyer psychology: framing, FOMO, social proof, status, and impulse triggers. Mimics high-ticket persuasion logic from elite sales and luxury branding.";
  }
  function getBusinessExplanation(level) {
    if (level <= 2) return "Focuses on basic details, simple value delivery, minimal justification.";
    if (level <= 4) return "Adds reasons and light benefits; appeals to logical value.";
    if (level <= 6) return "Integrates professional positioning, ROI logic, and subtle upsell cues.";
    if (level <= 8) return "Mimics MBA-level framing: cost/benefit, scarcity, proof, and premium justification.";
    return "Uses boardroom-level business strategy: framing unique value, competition, profit logic, and risk-proofing. Every word is justified like a top-tier consulting memo.";
  }
  function getInsightExplanation(level) {
    if (level <= 2) return "Simple, practical insight; no technical jargon.";
    if (level <= 4) return "Mixes basic research with a few data-backed statements for extra credibility.";
    if (level <= 6) return "Brings in targeted insight: recent stats, case examples, or trend references.";
    if (level <= 8) return "Explains logic with MBA/PhD-level justification, research tie-ins, and real examples.";
    return "Delivers research-grade, reference-backed rationale: market studies, academic insights, and proven frameworks, all tailored to your specific message.";
  }

  // END DOMContentLoaded
});
