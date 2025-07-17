//# ================================
//# main.js — e-SaSS Logic Engine
//# Fortune 500 A+ Quality
//# ================================

// DOM Load
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eSaSSForm");
  const progress = document.getElementById("progress");
  const output = document.getElementById("emailOutput");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    output.innerHTML = "";
    progress.innerText = "Crafting your smart email... ✨";

    // Collect form values
    const formData = new FormData(form);
    const purpose = formData.get("purpose")?.trim();
    const audience = formData.get("audience")?.trim();
    const sassLevel = parseInt(formData.get("sassLevel"));
    const friendliness = parseInt(formData.get("friendliness"));
    const psychology = parseInt(formData.get("psychology"));
    const business = parseInt(formData.get("business"));
    const technical = parseInt(formData.get("technical"));
    const background = formData.get("background")?.trim();
    const file = formData.get("upload");

    // Input validation
    if (!purpose || !audience) {
      progress.innerText = "Please fill in the required fields.";
      return;
    }

    // Assemble the user profile prompt
    const prompt = `
You are e-SaSS, an elite A.I. trained to write real estate emails using human psychology, business tone, and professional-grade communication. 
Craft TWO apology or correction-based email scripts for the following case:

Purpose: ${purpose}
Audience: ${audience}
Tone (SaSS Level): ${sassLevel}/10
Friendliness: ${friendliness}/10
Psychology Lens Depth: ${psychology}/10
Business Insight Lens: ${business}/10
Technical Analysis Depth: ${technical}/10

Context: ${background || "No summary provided."}

Please:
- Write 2 separate email options side-by-side
- Make each under 500 words
- Include psychological or business insight briefly below each
- Highlight tone choice and persuasion logic used
`;

    // If file was uploaded, include its name (not contents) in context
    if (file && file.name) {
      prompt += `\nFile uploaded by user for reference: ${file.name}`;
    }

    try {
      // Call to OpenAI (replace with real API call)
      const fakeResponse = await fakeOpenAI(prompt);
      output.innerHTML = `<pre class="gpt-output">${fakeResponse}</pre>`;
      progress.innerText = "✨ Email scripts generated below.";
    } catch (error) {
      console.error("Error generating email:", error);
      progress.innerText = "Error generating email. Try again.";
    }
  });
});

// Mock OpenAI Call — replace with real integration
async function fakeOpenAI(prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`--- EMAIL SCRIPT A ---\nDear [Name],\nI want to sincerely apologize for the confusion...\n\n--- EMAIL SCRIPT B ---\nHi [Name],\nThank you for your patience — let me clarify what happened...\n\n🧠 Psychology Lens: Used framing & emotional validation\n💼 Business Lens: Maintained professionalism, offered solution\n🛠️ Technical: Explained root issue & next steps`);
    }, 1500);
  });
}
