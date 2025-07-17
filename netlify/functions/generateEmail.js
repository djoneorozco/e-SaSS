// ==========================================
// # generateEmail.js — Netlify Serverless
// # e-SaSS V2 | Fortune 500 x Ivy League
// ==========================================
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);

    // Extract fields from client form
    const {
      purpose, audience, sassLevel, contextLevel,
      emojiLevel, background, fileName,
      psychology, business, technical
    } = body;

    // OpenAI Setup (uses .env OpenAI key)
    const configuration
