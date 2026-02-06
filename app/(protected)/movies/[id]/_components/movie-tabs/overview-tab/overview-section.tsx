type OverviewSectionProps = {
  overview: string;
};

function OverviewSection({ overview }: OverviewSectionProps) {
  return (
    <section className="relative">
      <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
      <p className="pl-2 text-[15px] leading-relaxed text-muted-foreground/90">{overview}</p>
    </section>
  );
}

export type { OverviewSectionProps };
export { OverviewSection };
