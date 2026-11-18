/**
 * Central API base URLs for the backend experiments (exp5–exp12).
 *
 * Locally each Express server runs on its own port, so those are the
 * defaults. In production set the matching `NEXT_PUBLIC_API_EXP*`
 * variable (Vercel → Project → Settings → Environment Variables) to the
 * deployed API origin, for example:
 *
 *   NEXT_PUBLIC_API_EXP5=https://ju-exp5.onrender.com
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, which is why every
 * variable is referenced explicitly instead of through a dynamic lookup.
 */

const FALLBACKS = {
  exp5: "http://localhost:4005",
  exp6: "http://localhost:4006",
  exp7: "http://localhost:4007",
  exp8: "http://localhost:4008",
  exp9: "http://localhost:4009",
  exp10: "http://localhost:4010",
  exp11: "http://localhost:4011",
  exp12: "http://localhost:4012",
} as const;

export type ApiExperiment = keyof typeof FALLBACKS;

const OVERRIDES: Record<ApiExperiment, string | undefined> = {
  exp5: process.env.NEXT_PUBLIC_API_EXP5,
  exp6: process.env.NEXT_PUBLIC_API_EXP6,
  exp7: process.env.NEXT_PUBLIC_API_EXP7,
  exp8: process.env.NEXT_PUBLIC_API_EXP8,
  exp9: process.env.NEXT_PUBLIC_API_EXP9,
  exp10: process.env.NEXT_PUBLIC_API_EXP10,
  exp11: process.env.NEXT_PUBLIC_API_EXP11,
  exp12: process.env.NEXT_PUBLIC_API_EXP12,
};

/** Base origin for an experiment API, without a trailing slash. */
export function apiBase(experiment: ApiExperiment): string {
  return (OVERRIDES[experiment] || FALLBACKS[experiment]).replace(/\/+$/, "");
}
