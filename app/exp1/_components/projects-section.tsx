import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { projects } from "../data";
import { SectionHeading } from "./section-heading";

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-24 py-14 md:py-20">
      <SectionHeading
        index="01"
        title="Projects"
        subtitle="A selection of things I've designed and shipped recently."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            target={project.link === "#" ? undefined : "_blank"}
            rel="noreferrer noopener"
            className="glass glass-hover group flex flex-col overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <div
              className="relative flex h-32 items-start justify-between p-4"
              style={{ background: project.gradient }}
            >
              <span className="text-3xl drop-shadow-sm" aria-hidden="true">
                {project.emoji}
              </span>
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                {project.year}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-bold tracking-tight">
                {project.title}
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="flex-1 text-xs leading-relaxed text-foreground/70">
                {project.description}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
