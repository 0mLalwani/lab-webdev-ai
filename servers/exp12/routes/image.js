/* exp12 · AI image generation (Pollinations / OpenAI / demo) + Gemini captioning */
const express = require("express");
const crypto = require("crypto");

const { asyncHandler, httpError } = require("../../lib/http");
const { configSummary, generateText, generateVision } = require("../../lib/ai");

/* Public, keyless image API: https://pollinations.ai */
const POLLINATIONS = "https://image.pollinations.ai/prompt/";

const STYLES = {
  photoreal: "photorealistic, 8k, sharp focus, natural lighting",
  "3d": "3D render, octane, soft studio lighting, high detail",
  watercolor: "watercolor painting, soft brush strokes, paper texture",
  anime: "anime style, vibrant colors, clean line art",
  neon: "cyberpunk neon aesthetic, dramatic lighting, high contrast",
  pixel: "pixel art, 16-bit retro game style",
};

const ASPECTS = {
  square: { w: 1024, h: 1024, openai: "1024x1024" },
  portrait: { w: 768, h: 1152, openai: "1024x1792" },
  landscape: { w: 1152, h: 768, openai: "1792x1024" },
};

function hashString(str) {
  return crypto.createHash("sha1").update(str).digest();
}

/* Local SVG placeholder art — guarantees a visible result with zero network. */
function demoSvg(prompt, seed) {
  const h = hashString(prompt + seed);
  const hue1 = h[0] * 360 / 255;
  const hue2 = (hue1 + 60 + h[1] % 80) % 360;
  const label = prompt.slice(0, 42).replace(/[<>&"]/g, "");
  const shapes = [0, 1, 2, 3].map((i) => {
    const cx = 120 + (h[i + 4] % 256) * 4;
    const cy = 120 + (h[i + 8] % 256) * 3;
    const r = 40 + (h[i + 12] % 120);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.14)"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue1},70%,55%)"/><stop offset="1" stop-color="hsl(${hue2},75%,35%)"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#g)"/>${shapes}<text x="60" y="920" font-family="monospace" font-size="34" fill="rgba(255,255,255,0.92)">DEMO · ${label}</text><text x="60" y="965" font-family="monospace" font-size="22" fill="rgba(255,255,255,0.7)">no AI image key configured</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function openaiImage(prompt, size) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: "dall-e-3", prompt, size, n: 1, response_format: "url" }),
    signal: AbortSignal.timeout(90000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw httpError(502, `OpenAI Images error: ${json.error?.message || res.status}`);
  }
  return json.data?.[0]?.url;
}

/* Gemini vision captioning goes through the shared AI layer so it gets
   the same model fallback, thinking budget and error reporting. */
async function geminiCaption(imageBase64, mimeType) {
  const { text } = await generateVision({
    prompt:
      "Describe this image in 1-3 concise sentences. Mention the main subject, setting and mood. Reply with the caption only.",
    imageBase64,
    mimeType,
    maxTokens: 300,
  });
  return text;
}

function createImageRouter() {
  const router = express.Router();

  router.get("/config", (req, res) =>
    res.json({ ...configSummary(), defaultImageProvider: "pollinations" })
  );

  /* POST /api/image/generate — { prompt, style?, aspect?, seed?, provider? } */
  router.post(
    "/generate",
    asyncHandler(async (req, res) => {
      const { prompt, style, aspect = "square", seed, provider } = req.body || {};

      const details = {};
      if (typeof prompt !== "string" || prompt.trim().length < 3)
        details.prompt = "Prompt must be at least 3 characters";
      else if (prompt.length > 500)
        details.prompt = "Prompt must be 500 characters or fewer";
      if (style && !Object.keys(STYLES).includes(style))
        details.style = `Style must be one of: ${Object.keys(STYLES).join(", ")}`;
      if (!Object.keys(ASPECTS).includes(aspect))
        details.aspect = `Aspect must be one of: ${Object.keys(ASPECTS).join(", ")}`;
      if (provider && !["auto", "pollinations", "openai", "demo"].includes(provider))
        details.provider = "Provider must be auto, pollinations, openai or demo";
      if (Object.keys(details).length > 0)
        throw httpError(400, "Validation Error", details);

      const finalSeed =
        Number.isFinite(Number(seed)) && seed !== "" && seed !== undefined
          ? Math.abs(Math.floor(Number(seed))) % 1000000
          : Math.floor(Math.random() * 1000000);
      const fullPrompt = style
        ? `${prompt.trim()}, ${STYLES[style]}`
        : prompt.trim();
      const dims = ASPECTS[aspect];

      if (provider === "demo") {
        return res.json({
          url: demoSvg(prompt.trim(), finalSeed),
          prompt: prompt.trim(),
          provider: "demo",
          seed: finalSeed,
          demo: true,
        });
      }

      if (provider === "openai") {
        if (!process.env.OPENAI_API_KEY)
          throw httpError(400, "OPENAI_API_KEY is not configured — use provider=pollinations or add a key");
        const url = await openaiImage(fullPrompt, dims.openai);
        return res.json({
          url,
          prompt: prompt.trim(),
          provider: "openai",
          seed: finalSeed,
          demo: false,
        });
      }

      /* Default: Pollinations — public, keyless */
      const url =
        `${POLLINATIONS}${encodeURIComponent(fullPrompt)}` +
        `?width=${dims.w}&height=${dims.h}&seed=${finalSeed}&nologo=true&model=flux`;
      res.json({
        url,
        prompt: prompt.trim(),
        provider: "pollinations",
        seed: finalSeed,
        demo: false,
      });
    })
  );

  /* POST /api/image/enhance — polish a prompt through the shared AI layer */
  router.post(
    "/enhance",
    asyncHandler(async (req, res) => {
      const { prompt, provider } = req.body || {};
      if (typeof prompt !== "string" || prompt.trim().length < 3)
        throw httpError(400, "Validation Error", { prompt: "Prompt must be at least 3 characters" });

      const result = await generateText({
        system:
          "You are a prompt engineer for text-to-image models. Expand the user's idea into one vivid, concrete image prompt (max 60 words) mentioning subject, setting, lighting and style. Reply with only the prompt.",
        messages: [{ role: "user", content: prompt.trim() }],
        maxTokens: 300,
        provider: provider || "auto",
        demo: (last) =>
          `${last.trim()}, highly detailed, balanced composition, soft natural lighting, cinematic color grading, trending on artstation`,
      });
      res.json(result);
    })
  );

  /* POST /api/image/caption — Gemini vision (requires GEMINI_API_KEY) */
  router.post(
    "/caption",
    asyncHandler(async (req, res) => {
      if (!process.env.GEMINI_API_KEY)
        throw httpError(
          400,
          "GEMINI_API_KEY is required for captioning — get a free key at https://aistudio.google.com/apikey and add it to .env"
        );

      const { image, mimeType } = req.body || {};
      if (typeof image !== "string" || image.length < 32)
        throw httpError(400, "Validation Error", { image: "Image data is required" });

      const match = image.match(/^data:([a-z/+.]+);base64,(.+)$/i);
      const mime = mimeType || match?.[1];
      const base64 = match ? match[2] : image;

      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mime))
        throw httpError(400, "Validation Error", {
          mimeType: "Supported images: jpeg, png, webp, gif",
        });
      if (base64.length > 6 * 1024 * 1024)
        throw httpError(400, "Validation Error", { image: "Image must be under 6MB" });

      const caption = await geminiCaption(base64, mime);
      res.json({ caption, provider: "gemini", demo: false });
    })
  );

  return router;
}

module.exports = { createImageRouter, STYLES, ASPECTS };

