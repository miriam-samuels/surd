import Image from "next/image";
import { FlashIcon } from "@hugeicons/core-free-icons";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CORE_VALUES, type CoreValue } from "@/content/about";
import { cn } from "@/lib/cn";

const tones: Record<CoreValue["tone"], string> = {
  pink: "bg-pink-50",
  aqua: "bg-aqua-50",
  orange: "bg-orange-50",
  green: "bg-green-50",
  purple: "bg-purple-50",
};

const fan = [
  "lg:-rotate-6",
  "lg:translate-y-6 lg:rotate-4",
  "lg:-translate-y-10 lg:-rotate-6",
  "lg:translate-y-0 lg:rotate-14",
  "lg:translate-y-2 lg:-rotate-10",
];

export function CoreValuesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container noPadding>
        <SectionHeading
          eyebrow={<Eyebrow icon={FlashIcon}>Core value</Eyebrow>}
          title={
            <>
              The values that guide
              <br className="hidden sm:block" /> our lives and work.
            </>
          }
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:flex lg:items-start lg:justify-center lg:gap-0 lg:py-8">
          {CORE_VALUES.map((value, index) => (
            <li
              key={value.title}
              className={cn(
                "flex flex-col rounded-2xl p-6 transition-transform duration-200",
                "lg:-mx-4 lg:h-50 lg:w-52 lg:shrink-0 lg:rounded-[1.25rem] lg:p-7",
                "xl:-mx-5 xl:h-60 xl:w-74",
                "lg:hover:z-10 lg:hover:translate-y-0 lg:hover:rotate-0",
                tones[value.tone],
                fan[index],
              )}
            >
              <Image
                src="/patterns/coin.svg"
                alt=""
                aria-hidden
                width={137}
                height={67}
                unoptimized
                className="h-auto w-24 lg:w-20 xl:w-36"
              />

              <div className="mt-auto pt-6 lg:pr-4 xl:pr-6">
                <h3 className="text-lg font-semibold text-grey-900 sm:text-xl lg:text-2xl">
                  {value.title}
                </h3>
                <p className="mt-2 text-paragraph-md text-grey-400 font-medium">
                  {value.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
