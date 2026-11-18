import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="衡膳餐饮首页">
      <span
        className={`grid size-10 place-items-center rounded-full border font-serif text-xl ${
          light ? "border-white/35 text-white" : "border-[#174c3e]/35 text-[#174c3e]"
        }`}
        aria-hidden="true"
      >
        衡
      </span>
      <span className="leading-none">
        <span
          className={`block font-serif text-xl font-semibold tracking-[0.16em] ${light ? "text-white" : "text-[#173c32]"}`}
        >
          衡膳餐饮
        </span>
        <span
          className={`mt-1.5 block text-[8px] font-semibold tracking-[0.2em] ${light ? "text-white/55" : "text-[#53625d]"}`}
        >
          HENGSHAN CATERING
        </span>
      </span>
    </Link>
  );
}
