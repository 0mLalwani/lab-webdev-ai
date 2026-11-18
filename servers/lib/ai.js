/* Shared Generative-AI provider layer (used by exp9–exp12).
   Talks to OpenAI and Gemini via their plain REST APIs using native
   fetch — no SDK dependencies. Falls back to a deterministic DEMO
   mode when no API key is configured, so the apps always work.

   Environment:
     OPENAI_API_KEY, GEMINI_API_KEY, AI_PROVIDER (openai|gemini)
     OPENAI_MODEL   (default gpt-4o-mini)
     GEMINI_MODEL   (default gemini-4-hydrogen)
     GEMINI_FALLBACK_MODELS  comma-separated, tried when the primary
                    model is rate-limited or overloaded (default
                    gemini-3.1-flash-lite)
     GEMINI_THINKING_LEVEL   minimal|low|medium|high|xhigh
                    (default low — Gemini 4 models always think, and
                    thinking tokens are billed against maxOutputTokens)
     GEMINI_TIMEOUT_MS       default 120000 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const DEFAULT_GEMINI_MODEL = "gemini-4-hydrogen";
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 120000;
const GEMINI_MAX_OUTPUT = 8192;
/* Gemini 4 always reasons before answering and those tokens count
   towards maxOutputTokens, so every request gets extra headroom.
   Without it a 120-token budget is spent thinking and the response
   comes back empty with finishReason MAX_TOKENS. */
const GEMINI_THINKING_HEADROOM =
  Number(process.env.GEMINI_THINKING_HEADROOM) || 2048;
const GEMINI_THINKING_LEVELS = ["minimal", "low", "medium", "high", "xhigh"];

function httpError(status, message) {
  const err = new Error(message);
  err.statusCode = status;
  err.expose = true;
  return err;
}

/** Which provider is usable right now ("demo" when no keys are set). */
function activeProvider() {
  const forced = String(process.env.AI_PROVIDER || "").toLowerCase();
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  if (forced === "openai" && hasOpenAI) return "openai";
  if (forced === "gemini" && hasGemini) return "gemini";
  if (hasGemini) return "gemini";
  if (hasOpenAI) return "openai";
  return "demo";
}

function configSummary() {
  return {
    provider: activeProvider(),
    demo: activeProvider() === "demo",
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model:
      activeProvider() === "gemini"
        ? geminiModelChain()[0]
        : process.env.OPENAI_MODEL || "gpt-4o-mini",
  };
}

/* ------------------------------------------------------------- OpenAI */

async function callOpenAI({ system, messages, maxTokens }) {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const payload = {
    model,
    max_tokens: maxTokens,
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      ...messages,
    ],
  };

  let res;
  try {
    res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw httpError(502, "Could not reach the OpenAI API (network error)");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = json.error?.message || `HTTP ${res.status}`;
    throw httpError(res.status === 401 ? 401 : 502, `OpenAI error: ${detail}`);
  }
  return {
    text: json.choices?.[0]?.message?.content?.trim() || "(empty response)",
    model: json.model || model,
  };
}

/* ------------------------------------------------------------- Gemini */

/** Primary model first, then any configured fallbacks (deduplicated). */
function geminiModelChain() {
  const primary = (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL).trim();
  const fallbacks = String(
    process.env.GEMINI_FALLBACK_MODELS ?? "gemini-3.1-flash-lite"
  )
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return [...new Set([primary, ...fallbacks])];
}

/**
 * Gemini counts thinking tokens against maxOutputTokens. Give the answer
 * its requested budget plus headroom for reasoning.
 */
function geminiGenerationConfig(maxTokens) {
  const answerBudget = Math.max(256, Number(maxTokens) || 512);
  const config = {
    maxOutputTokens: Math.min(
      GEMINI_MAX_OUTPUT,
      answerBudget + GEMINI_THINKING_HEADROOM
    ),
  };

  const level = String(process.env.GEMINI_THINKING_LEVEL || "low").toLowerCase();
  if (GEMINI_THINKING_LEVELS.includes(level)) {
    config.thinkingConfig = { thinkingLevel: level };
  }
  return config;
}

async function geminiRequest(model, payload) {
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    });
  } catch (err) {
    const timedOut = err?.name === "TimeoutError" || err?.name === "AbortError";
    throw httpError(
      timedOut ? 504 : 502,
      timedOut
        ? `Gemini timed out after ${Math.round(
            GEMINI_TIMEOUT_MS / 1000
          )}s (${model}). Try again or lower GEMINI_THINKING_LEVEL.`
        : "Could not reach the Gemini API (network error)"
    );
  }

  return { res, json: await res.json().catch(() => ({})) };
}

function geminiErrorDetail(json) {
  return json?.error?.message || "";
}

function throwGeminiError(res, json, model) {
  const detail = geminiErrorDetail(json) || `HTTP ${res.status}`;

  if (res.status === 429) {
    const perDay = /per day|daily/i.test(detail);
    throw httpError(
      429,
      `Gemini ${perDay ? "daily" : "rate"} limit reached for ${model}. ${
        perDay ? "The free tier resets at midnight Pacific." : "Retry in a moment."
      } Configure GEMINI_FALLBACK_MODELS or use provider=demo.`
    );
  }
  if (res.status === 503) {
    throw httpError(
      503,
      `Gemini model ${model} is overloaded right now — try again in a moment.`
    );
  }
  if (res.status === 400 && /API key/i.test(detail)) {
    throw httpError(401, `Gemini API key rejected: ${detail}`);
  }
  throw httpError(502, `Gemini error (${model}): ${detail}`);
}

/** Join the visible answer, ignoring thought parts and explaining empties. */
function geminiText(json, model) {
  const candidate = json.candidates?.[0];
  const finish = candidate?.finishReason;

  const text = (candidate?.content?.parts || [])
    .filter((part) => part.thought !== true)
    .map((part) => part.text || "")
    .join("")
    .trim();

  if (text) return text;

  const blocked = json.promptFeedback?.blockReason;
  if (blocked) {
    throw httpError(422, `Gemini blocked this prompt (${blocked}). Try rephrasing it.`);
  }
  if (finish === "MAX_TOKENS") {
    throw httpError(
      502,
      `Gemini used the whole output budget while thinking (${model}). Raise maxTokens or set GEMINI_THINKING_LEVEL=low.`
    );
  }
  if (finish === "SAFETY" || finish === "PROHIBITED_CONTENT") {
    throw httpError(422, `Gemini refused this request (${finish}). Try rephrasing it.`);
  }
  if (finish === "RECITATION") {
    throw httpError(
      422,
      "Gemini stopped because the answer would reproduce protected text. Try rephrasing it."
    );
  }
  throw httpError(
    502,
    `Gemini returned no text (${model}, finishReason: ${finish || "unknown"}).`
  );
}

async function callGeminiModel(model, { system, messages, maxTokens }) {
  const payload = {
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    generationConfig: geminiGenerationConfig(maxTokens),
  };

  let { res, json } = await geminiRequest(model, payload);

  // Not every model accepts thinkingConfig — retry once without it.
  if (
    res.status === 400 &&
    payload.generationConfig.thinkingConfig &&
    /thinking/i.test(geminiErrorDetail(json))
  ) {
    delete payload.generationConfig.thinkingConfig;
    ({ res, json } = await geminiRequest(model, payload));
  }

  if (!res.ok) throwGeminiError(res, json, model);
  return { text: geminiText(json, model), model };
}

/** Try models in order, moving on when one is rate-limited or overloaded. */
async function withGeminiFallback(run) {
  const models = geminiModelChain();
  let lastError;

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index];
    try {
      return await run(model);
    } catch (err) {
      lastError = err;
      const retryable = [429, 503, 504].includes(err.statusCode);
      if (!retryable || index === models.length - 1) throw err;
      console.warn(
        `[ai] ${model} unavailable (${err.statusCode}); retrying with ${models[index + 1]}`
      );
    }
  }

  throw lastError;
}

async function callGemini({ system, messages, maxTokens }) {
  return withGeminiFallback((model) =>
    callGeminiModel(model, { system, messages, maxTokens })
  );
}

/** Caption an image with a Gemini vision model. */
async function generateVision({ prompt, imageBase64, mimeType, maxTokens = 300 }) {
  return withGeminiFallback(async (model) => {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
          ],
        },
      ],
      generationConfig: geminiGenerationConfig(maxTokens),
    };

    const { res, json } = await geminiRequest(model, payload);
    if (!res.ok) throwGeminiError(res, json, model);
    return { text: geminiText(json, model), model };
  });
}

/* ------------------------------------------------------------ public */

/**
 * Generate a chat/text completion.
 * @param {{ system?: string, messages: {role:"user"|"assistant",content:string}[],
 *           maxTokens?: number, provider?: "auto"|"openai"|"gemini"|"demo",
 *           demo?: (lastUser: string) => string }} options
 */
async function generateText({ system, messages, maxTokens = 512, provider, demo }) {
  let chosen = provider && provider !== "auto" ? provider : activeProvider();

  if (chosen === "openai" && !process.env.OPENAI_API_KEY)
    throw httpError(400, "OPENAI_API_KEY is not configured — add it to .env or use provider=demo");
  if (chosen === "gemini" && !process.env.GEMINI_API_KEY)
    throw httpError(400, "GEMINI_API_KEY is not configured — add it to .env or use provider=demo");

  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content || "";

  if (chosen === "demo") {
    const text = demo
      ? demo(lastUser)
      : `DEMO MODE — no API key configured.\n\nYou asked: "${lastUser.slice(0, 160)}"\n\nAdd OPENAI_API_KEY or GEMINI_API_KEY to .env and restart the server for a real AI answer.`;
    return { text, provider: "demo", model: "demo-template", demo: true };
  }

  const result =
    chosen === "openai"
      ? await callOpenAI({ system, messages, maxTokens })
      : await callGemini({ system, messages, maxTokens });

  return { text: result.text, provider: chosen, model: result.model, demo: false };
}

module.exports = {
  activeProvider,
  configSummary,
  generateText,
  generateVision,
  geminiModelChain,
};
