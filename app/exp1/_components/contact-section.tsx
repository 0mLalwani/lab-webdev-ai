"use client";

import * as React from "react";
import { CircleCheckBig, Mail, MapPin, Phone, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { profile, socials } from "../data";
import { SectionHeading } from "./section-heading";

export function ContactSection() {
  const [sent, setSent] = React.useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Demo only — no backend. Replace with your own endpoint.
    setSent(true);
  }

  return (
    <section id="contact" className="scroll-mt-24 py-14 md:py-20">
      <SectionHeading
        index="03"
        title="Contact"
        subtitle="Have a project in mind? The tide is right — say hello."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {/* Form */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base tracking-tight">
              Send a message
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            {sent ? (
              <div
                role="status"
                className="glass-soft flex items-start gap-3 rounded-xl p-4 text-xs leading-relaxed"
              >
                <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>
                  <strong className="font-semibold">Message sent!</strong>
                  <br />
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </span>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/60">
                      Name
                    </span>
                    <Input
                      name="name"
                      required
                      placeholder="Your name"
                      autoComplete="name"
                      className="rounded-xl bg-white/60"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/60">
                      Email
                    </span>
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="rounded-xl bg-white/60"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/60">
                    Message
                  </span>
                  <Textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your idea..."
                    className="rounded-xl bg-white/60"
                  />
                </label>
                <Button
                  type="submit"
                  className="mt-1 w-full rounded-full sm:w-auto"
                >
                  <Send className="size-4" />
                  Send message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base tracking-tight">
              Reach me directly
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 p-6 pt-4">
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <span className="grid size-9 place-items-center rounded-lg glass-strong text-sky-700">
                    <Mail className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-foreground/50">
                      Email
                    </span>
                    <span className="block truncate text-xs font-medium">
                      {profile.email}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <span className="grid size-9 place-items-center rounded-lg glass-strong text-sky-700">
                    <Phone className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-foreground/50">
                      Phone
                    </span>
                    <span className="block truncate text-xs font-medium">
                      {profile.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 rounded-xl p-2">
                  <span className="grid size-9 place-items-center rounded-lg glass-strong text-sky-700">
                    <MapPin className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-foreground/50">
                      Location
                    </span>
                    <span className="block truncate text-xs font-medium">
                      {profile.location}
                    </span>
                  </span>
                </div>
              </li>
            </ul>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/50">
                Socials
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.key}
                    href={social.url}
                    target={
                      social.url.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel="noreferrer noopener"
                    className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    {social.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
