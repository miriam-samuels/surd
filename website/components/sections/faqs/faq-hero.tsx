import Image from "next/image";
import { HeroBand } from "@/components/layout/hero-band";
import { FaqSearch } from "@/components/sections/faqs/faq-browser";
import { FAQ_HERO } from "@/content/faqs";

export function FaqHero({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <HeroBand
      tone="dark"
      eyebrow={
        <span className="mb-2 grid size-26 shrink-0 place-items-center overflow-hidden rounded-[18px] bg-grey-900 sm:mb-6">
          <Image
            src="/clips/faq.svg"
            alt=""
            aria-hidden
            width={150}
            height={150}
            unoptimized
            className="h-auto w-40"
          />
        </span>
      }
      title={FAQ_HERO.title}
      description={FAQ_HERO.body}
    >
      <FaqSearch value={query} onChange={onQueryChange} />
    </HeroBand>
  );
}
