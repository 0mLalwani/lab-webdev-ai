type SectionHeadingProps = {
  index: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ index, title, subtitle }: SectionHeadingProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200/90">
          {index} · section
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(2,20,45,0.45)] sm:text-4xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="hidden max-w-xs text-right text-xs leading-relaxed text-white/80 sm:block">
          {subtitle}
        </p>
      )}
    </header>
  );
}
