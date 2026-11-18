import type { Metadata } from "next";
import Link from "next/link";

import { DomLab } from "./_components/dom-lab";
import "./exp3.css";

export const metadata: Metadata = {
  title: "exp3 · Interactive DOM Lab",
  description:
    "Interactive web page built with vanilla JavaScript, direct DOM manipulation and AI-generated scripts.",
};

export default function Exp3Page() {
  return (
    <main className="exp3 mx-auto min-h-svh w-full max-w-6xl px-5 py-14 sm:px-8">
      <header className="max-w-3xl">
        <span className="lab-badge">exp3 · vanilla JS</span>
        <h1 className="lab-title">Interactive DOM Lab</h1>
        <p className="lab-lead">
          Every widget below is wired up with plain JavaScript —{" "}
          <code>addEventListener</code>, <code>createElement</code>,{" "}
          <code>querySelector</code>, <code>IntersectionObserver</code> and{" "}
          <code>requestAnimationFrame</code>. No React state is used; the
          scripts manipulate the DOM directly (all AI-generated, commented in
          the source).
        </p>
      </header>

      <DomLab />

      <footer className="lab-footer">
        exp3 · interactive page — JavaScript · DOM manipulation · AI-generated
        scripts ·{" "}
        <Link href="/">back to all experiments</Link>
      </footer>
    </main>
  );
}
