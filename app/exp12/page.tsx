"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp12 · AI Image Studio — text-to-image generation via public APIs
   (Pollinations keyless / OpenAI DALL·E) + Gemini image captioning.
   Backed by the Express API on :4012. */

const API = `${apiBase("exp12")}/api`;

const STYLES = [
  { id: "photoreal", icon: "🖼️", label: "Photoreal" },
  { id: "3d", icon: "🧊", label: "3D render" },
  { id: "watercolor", icon: "🎨", label: "Watercolor" },
  { id: "anime", icon: "🌸", label: "Anime" },
  { id: "neon", icon: "🌃", label: "Neon" },
  { id: "pixel", icon: "👾", label: "Pixel art" },
] as const;

const ASPECTS = [
  { id: "square", label: "1:1", hint: "1024 × 1024" },
  { id: "portrait", label: "2:3", hint: "768 × 1152" },
  { id: "landscape", label: "3:2", hint: "1152 × 768" },
] as const;

const EXAMPLE_PROMPTS = [
  "A lighthouse in a storm, dramatic lighting",
  "Isometric city at night, glowing windows",
  "Watercolor fox in an autumn forest",
];

type StyleId = (typeof STYLES)[number]["id"];
type AspectId = (typeof ASPECTS)[number]["id"];

type Config = {
  provider: string;
  demo: boolean;
  geminiConfigured?: boolean;
} | null;

type Result = {
  url: string;
  prompt: string;
  provider: string;
  seed: number;
  demo: boolean;
};

type GalleryItem = Result & {
  style: StyleId | "";
  aspect: AspectId;
  at: number;
};

type Upload = {
  dataUrl: string;
  mimeType: string;
  name: string;
};

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

const buttonCls =
  "rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50";

export default function Exp12Page() {
  const [config, setConfig] = React.useState<Config>(null);
  const [offline, setOffline] = React.useState(false);
  const [tab, setTab] = React.useState<"generate" | "caption">("generate");
  const [error, setError] = React.useState<string | null>(null);

  /* --- generation state --- */
  const [prompt, setPrompt] = React.useState("");
  const [style, setStyle] = React.useState<StyleId | "">("photoreal");
  const [aspect, setAspect] = React.useState<AspectId>("square");
  const [seed, setSeed] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [enhancing, setEnhancing] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);
  const [imageFailed, setImageFailed] = React.useState(false);
  const [gallery, setGallery] = React.useState<GalleryItem[]>([]);

  /* --- caption state --- */
  const [upload, setUpload] = React.useState<Upload | null>(null);
  const [caption, setCaption] = React.useState<string | null>(null);
  const [captioning, setCaptioning] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    fetch(`${API}/image/config`)
      .then((res) => res.json())
      .then((json: Config) => setConfig(json))
      .catch(() => setOffline(true));
  }, []);

  const captionReady = Boolean(config?.geminiConfigured);

  async function generate() {
    if (prompt.trim().length < 3) {
      setError("Prompt must be at least 3 characters.");
      return;
    }
    setGenerating(true);
    setError(null);
    setResult(null);
    setImageFailed(false);
    try {
      const res = await fetch(`${API}/image/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: style || undefined,
          aspect,
          seed: seed === "" ? undefined : Number(seed),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          json.details
            ? Object.values(json.details).join(" · ")
            : json.error || "Request failed"
        );
      }
      setResult(json);
      setGallery((prev) =>
        [
          { ...json, style, aspect, at: Date.now() },
          ...prev.filter((item) => item.url !== json.url),
        ].slice(0, 9)
      );
      setOffline(false);
    } catch (err) {
      if (err instanceof TypeError) {
        setOffline(true);
        setError("Cannot reach the API — run `npm run server:exp12`.");
      } else {
        setError(err instanceof Error ? err.message : "Generation failed");
      }
    } finally {
      setGenerating(false);
    }
  }

  async function enhance() {
    if (prompt.trim().length < 3) {
      setError("Write at least 3 characters before enhancing.");
      return;
    }
    setEnhancing(true);
    setError(null);
    try {
      const res = await fetch(`${API}/image/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          json.details
            ? Object.values(json.details).join(" · ")
            : json.error || "Enhance failed"
        );
      setPrompt(json.text);
      setOffline(false);
    } catch (err) {
      if (err instanceof TypeError) {
        setOffline(true);
        setError("Cannot reach the API — run `npm run server:exp12`.");
      } else {
        setError(err instanceof Error ? err.message : "Enhance failed");
      }
    } finally {
      setEnhancing(false);
    }
  }

  function pickFile(file: File | undefined) {
    setCaption(null);
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
    ) {
      setError("Choose a JPEG, PNG, WebP or GIF image.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError("Image must be under 6 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () =>
      setUpload({
        dataUrl: String(reader.result),
        mimeType: file.type,
        name: file.name,
      });
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsDataURL(file);
  }

  async function captionImage() {
    if (!upload) return;
    setCaptioning(true);
    setError(null);
    try {
      const res = await fetch(`${API}/image/caption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: upload.dataUrl,
          mimeType: upload.mimeType,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          json.details
            ? Object.values(json.details).join(" · ")
            : json.error || "Caption failed"
        );
      }
      setCaption(json.caption);
      setOffline(false);
    } catch (err) {
      if (err instanceof TypeError) {
        setOffline(true);
        setError("Cannot reach the API — run `npm run server:exp12`.");
      } else {
        setError(err instanceof Error ? err.message : "Caption failed");
      }
    } finally {
      setCaptioning(false);
    }
  }

  async function copyCaption() {
    if (!caption) return;
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard unavailable in this browser.");
    }
  }

  function openImage(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-5 py-12 sm:px-8">
      <header>
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
          exp12 · AI image generation &amp; captioning
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          AI Image Studio
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Generate images from text with public AI APIs — Pollinations works
          instantly with no key, DALL·E is used when an OpenAI key is set. The
          caption tab describes any uploaded image with Gemini vision.
        </p>
      </header>

      <div
        className={`mt-5 flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium ${
          offline
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        }`}
        role="status"
      >
        <span
          className={`size-2 rounded-full ${
            offline ? "bg-rose-500" : "bg-emerald-500"
          }`}
          aria-hidden="true"
        />
        {offline
          ? "API offline — start it with:  npm run server:exp12"
          : "Image API connected · Pollinations needs no key · captions need a free Gemini key"}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
        >
          {error}
        </p>
      )}

      {/* Tabs */}
      <div
        className="mt-6 inline-flex rounded-full border border-slate-200 bg-white p-1"
        role="tablist"
        aria-label="Image tools"
      >
        {[
          { id: "generate", label: "✨ Generate" },
          { id: "caption", label: "🏷️ Caption" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id as "generate" | "caption");
              setError(null);
            }}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
              tab === t.id
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "generate" ? (
        <>
          {/* Prompt + options */}
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Prompt *
              </span>
              <textarea
                className={`${inputCls} mt-2 h-24 resize-y leading-relaxed`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want — subject, setting, mood…"
                maxLength={500}
                aria-label="Image prompt"
              />
            </label>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">{prompt.length}/500</p>
              <button
                type="button"
                onClick={enhance}
                disabled={enhancing || generating}
                className={buttonCls}
                title="Expand the prompt with AI"
              >
                {enhancing ? "Enhancing…" : "🪄 Enhance prompt"}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-[11px] text-slate-500 hover:bg-slate-50"
                >
                  {ex.slice(0, 38)}…
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Style
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        style === s.id
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Aspect ratio
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ASPECTS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAspect(a.id)}
                      title={a.hint}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        aspect === a.id
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>

                <label className="mt-4 block sm:max-w-[10rem]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Seed <span className="normal-case text-slate-300">(optional)</span>
                  </span>
                  <input
                    type="number"
                    className={`mt-2 ${inputCls}`}
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="random"
                    min={0}
                    aria-label="Seed"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="mt-5 w-full rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
            >
              {generating ? "Painting…" : "Generate image ✨"}
            </button>
          </section>

          {/* Result */}
          {generating && (
            <section className="mt-6 grid min-h-[16rem] place-items-center rounded-2xl border border-indigo-200 bg-indigo-50/60 p-8 text-sm text-indigo-500">
              Generating your image — this usually takes a few seconds…
            </section>
          )}

          {!generating && result && (
            <section className="mt-6 rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Result · {result.provider}
                  <span className="ml-2 font-normal text-slate-400">
                    seed {result.seed}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPrompt(result.prompt)}
                    className={buttonCls}
                  >
                    Reuse prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => openImage(result.url)}
                    className={buttonCls}
                  >
                    Open image ↗
                  </button>
                </div>
              </div>

              {imageFailed ? (
                <p className="mt-3 rounded-xl bg-rose-50 px-4 py-6 text-center text-xs font-medium text-rose-700">
                  The image host did not return this picture. Try generating
                  again or open it directly.
                </p>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.url}
                  alt={result.prompt}
                  onError={() => setImageFailed(true)}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50"
                />
              )}

              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-600">Prompt:</span>{" "}
                {result.prompt}
              </p>
            </section>
          )}

          {!generating && !result && (
            <section className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
              Your generated image will appear here.
            </section>
          )}

          {/* Gallery */}
          {gallery.length > 1 && (
            <section className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Recent images
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {gallery.map((item) => (
                  <button
                    key={item.at}
                    type="button"
                    onClick={() => {
                      setPrompt(item.prompt);
                      setStyle(item.style);
                      setAspect(item.aspect);
                      setSeed(String(item.seed));
                      setResult(item);
                      setImageFailed(false);
                      setError(null);
                    }}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-indigo-400"
                    title={item.prompt}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.prompt}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Caption tab */
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {!captionReady && (
            <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              Captioning uses Gemini vision and needs a free API key. Get one at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                aistudio.google.com/apikey
              </a>
              , add <code className="rounded bg-amber-100 px-1">GEMINI_API_KEY</code>{" "}
              to <code className="rounded bg-amber-100 px-1">.env</code>, then
              restart the server.
            </div>
          )}

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Upload an image
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => pickFile(e.target.files?.[0])}
              className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-700"
            />
          </label>
          <p className="mt-1 text-[11px] text-slate-400">
            JPEG, PNG, WebP or GIF · max 6 MB · the image is sent to Gemini for
            description.
          </p>

          {upload && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={upload.dataUrl}
                  alt="Selected upload"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 object-contain"
                />
                <p className="mt-1 truncate text-[11px] text-slate-400">
                  {upload.name}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={captionImage}
                  disabled={!captionReady || captioning}
                  className="w-full rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {captioning ? "Describing…" : "Caption image 🏷️"}
                </button>
                {!captionReady && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Disabled until a Gemini key is configured.
                  </p>
                )}

                {caption && (
                  <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                        Caption · Gemini
                      </p>
                      <button
                        type="button"
                        onClick={copyCaption}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        {copied ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <footer className="mt-12 border-t border-dashed border-slate-300 pt-5 text-xs text-slate-400">
        exp12 · AI Image Generation &amp; Captioning — Pollinations · DALL·E ·
        Gemini vision ·{" "}
        <Link href="/" className="text-indigo-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}
