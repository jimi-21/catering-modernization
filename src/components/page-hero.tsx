export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-[#f4f3ee]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-[#a15d39]">
          <span className="h-px w-7 bg-[#a15d39]" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-serif text-[clamp(2.5rem,1.8rem+3vw,4.75rem)] leading-tight font-semibold tracking-tight text-balance text-[#173c32]">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#64716c] sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
