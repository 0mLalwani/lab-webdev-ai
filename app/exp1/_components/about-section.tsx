import { GraduationCap, Mail, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { aboutParagraphs, profile, skills, timeline } from "../data";
import { SectionHeading } from "./section-heading";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 py-14 md:py-20">
      <SectionHeading
        index="02"
        title="About Me"
        subtitle="Who I am, what I know, and where I've been."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
        {/* Identity card */}
        <Card className="glass rounded-2xl">
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-800 text-xl font-bold text-white shadow-lg">
              {profile.initials}
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight">{profile.name}</p>
              <p className="text-xs text-foreground/70">{profile.role}</p>
            </div>
            <ul className="flex flex-col gap-2 text-xs text-foreground/75">
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-sky-700" />
                {profile.location}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-sky-700" />
                {profile.email}
              </li>
              <li className="flex items-center gap-2">
                <GraduationCap className="size-3.5 shrink-0 text-sky-700" />
                Open to opportunities
              </li>
            </ul>
            <Button asChild size="sm" className="mt-1 rounded-full">
              <a href="#contact">Get in touch</a>
            </Button>
          </CardContent>
        </Card>

        {/* Bio + skills + timeline */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base tracking-tight">
              A bit more about me
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 p-6 pt-4">
            <div className="flex flex-col gap-3">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-xs leading-relaxed text-foreground/80 sm:text-sm">
                  {paragraph}
                </p>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/50">
                Skills
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-[11px] font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/50">
                Journey
              </p>
              <ol className="relative mt-4 space-y-5 border-l border-white/70 pl-5">
                {timeline.map((item) => (
                  <li key={item.title} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[27px] top-1 size-3 rounded-full border-2 border-white bg-sky-500 shadow"
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-800/80">
                      {item.period}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-foreground/70">
                      {item.place} — {item.note}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
