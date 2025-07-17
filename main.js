// ==============================
// main.js — e-SaSS Logic
// ==============================

document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Collect basic form fields
  const payload = {
    purpose: formData.get("purpose"),
    audience: formData.get("audience"),
    sassLevel: formData.get("sassLevel"),
    friendliness: formData.get("friendliness"),
    psychology: formData.get("psychology"),
    business: formData.get("business"),
    insight: formData.get("insight"),
    contextText: formData.get("contextText") || ""
  };

  // =========================
  // Optional file upload
  // =========================
  const file = formData.get("contextFile");
  if (file && file.size > 0) {
    const uploadPayload = new FormData();
    uploadPayload.append("file", file);

    try {
      const uploadRes = await fetch("/.netlify/functions/getUpload", {
        method: "POST",
        body: uploadPayload
      });

      const uploadResult = await uploadRes.json();
      if (uploadResult.success) {
        payload.fileReference = uploadResult.filename;
      } else {
        console.warn("Upload failed:", uploadResult.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  }

  // =========================
  // Send to OpenAI handler
  // =========================
  try {
    const res = await fetch("/.netlify/functions/getHandler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("eSaSS_ResponseA", data.optionA);
      localStorage.setItem("eSaSS_ResponseB", data.optionB);
      localStorage.setItem("eSaSS_Insights", data.explanation);
      window.location.href = "results.html";
    } else {
      alert("Something went wrong: " + data.message);
    }
  } catch (err) {
    console.error("AI Request Error:", err);
    alert("Something went wrong. Please try again.");
  }
});
