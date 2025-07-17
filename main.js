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

    // Gather form data
    const formData = new FormData(form);
    const purpose = formData.get("purpose");
    const audience = formData.get("audience");
    const sassLevel = parseInt(formData.get("sassLevel"));
    const contextDepth = parseInt(formData.get("contextDepth"));
    const emojiSlang = parseInt(formData.get("emojiSlang"));
    const background = formData.get("background")?.trim();
    const file = formData.get("upload");

    // Optional lens depth
    const useLenses = formData.get("lensToggle") === "on";
    const psychology = useLenses ? parseInt(formData.get("psychology")) : null;
    const business = useLenses ? parseInt(formData.get("business")) : null;
    const technical = useLenses ? parseInt(formData.get("technical")) : null;

    // Basic validation
    if (!purpose || !audience) {
      progress.innerText = "Please complete required fields.";
      return;
    }

    // Build prompt
    let prompt = `
You are e-SaSS, an elite A.I. assistant trained in psychology, business etiquette, and persuasive communication. Write TWO polished real estate emails based on the following inputs:

Message Purpose: ${purpose}
Recipient Type: ${audience}
Tone (SaSS Level): ${sassLevel}/10
Context Depth: ${contextDepth}/10
Emoji/Slang Usage: ${emojiSlang}/10
Context Provided: ${background || "No summary provided."}
`;

    if (file && file.name) {
      prompt += `\nFile Uploaded by User: ${file.name}`;
    }

    // Append lens depth only for backend logic — not for output
    if (useLenses) {
      prompt += `\nPsychology Lens: ${psychology}/10\nBusiness Lens: ${business}/10\nInsight Depth: ${technical}/10`;
    }

    prompt += `
Write two separate email scripts (under 500 words each), displayed side-by-side.
After each email, add a short explanation of the tone or persuasion logic used.
Use advanced insight based on the tone, audience, and purpose.
`;

    try {
      // Replace with actual OpenAI call when ready
      const gptResponse = await fakeOpenAI(prompt);

      // Render output
      output.innerHTML = `<pre>${gptResponse}</pre>`;
      outputWrapper.style.display = "block";
      progress.innerText = "✨ Your smart email is ready!";

      // Lens Breakdown if enabled
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

// Simulated OpenAI call — replace this with actual integration
async function fakeOpenAI(prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`--- EMAIL SCRIPT A ---\nDear [Client],\nWe’re excited to introduce you to your new home opportunity...\n\n--- EMAIL SCRIPT B ---\nHi [Buyer],\nHope you're doing great! Wanted to share an exciting new listing...\n\n🔍 Tone Strategy: Used warmth, clarity, and positioning based on tone level\n💬 Persuasion Tactic: Tailored language to match buyer expectations`);
    }, 1800);
  });
}
