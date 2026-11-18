export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={`mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] ${light ? "text-[#efb58e]" : "text-[#a15d39]"}`}
      >
        <span
          className={`h-px w-7 ${light ? "bg-[#efb58e]" : "bg-[#a15d39]"}`}
          aria-hidden="true"
        />
        {eyebrow}
      </p>
      <h2
        className={`font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[44px] ${light ? "text-white" : "text-[#173c32]"}`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 max-w-2xl text-base leading-8 ${light ? "text-white/60" : "text-[#64716c]"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
