import Image from "next/image";
import { Section, SectionHeading } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PRODUCTS, PRODUCTS_INTRO, type Product } from "@/content/landing";
import { cn } from "@/lib/cn";
import { SHIMMER } from "@/lib/image-placeholder";
import { FlashIcon } from "@hugeicons/core-free-icons";

const tones: Record<
  Product["tone"],
  {
    card: string;
    pill: string;
    button: string;
    border: string;
    text: string;
  }
> = {
  green: {
    card: "bg-green-50",
    pill: "bg-transparent text-green-700",
    button: "bg-green-600 hover:bg-green-900 text-white rounded-full font-semibold px-6",
    border: "border-green-700",
    text: "text-green-900",
  },
  yellow: {
    card: "bg-orange-50",
    pill: "bg-transparent text-orange-800",
    button: "bg-orange-500 hover:bg-orange-900 text-white rounded-full font-semibold px-6",
    border: "border-orange-800",
    text: "text-orange-800",
  },
  pink: {
    card: "bg-pink-50",
    pill: "bg-transparent text-pink-800",
    button: "bg-pink-600 hover:bg-pink-900 text-white rounded-full font-semibold px-6",
    border: "border-pink-800",
    text: "text-pink-800",
  },
};

const productMedia: Record<
  string,
  {
    clip: string;
    pattern1?: string;
    pattern2?: string;
    patternPosition1?: string;
    patternPosition2?: string;
  }
> = {
  "target-savings": {
    clip: "/clips/Onboarding 228.svg",
    pattern1: "/patterns/Ellipse 67.svg",
    patternPosition1: "bottom-0 -left-9 w-24 sm:w-28",
  },
  "fixed-deposit": {
    clip: "/clips/Onboarding 605.svg",
    pattern1: "/patterns/Star 1.svg",
    patternPosition1: "bottom-0 -right-9 w-16 sm:w-20",
    pattern2: "/patterns/Star 2.svg",
    patternPosition2: "bottom-1 -right-11 w-20 sm:w-24",
  },
  "flexi-wallet": {
    clip: "/clips/Home screen.svg",
    pattern1: "/patterns/Soft Flower.svg",
    patternPosition1: "bottom-0 -right-9 w-16 sm:w-20",
  },
};

export function ProductsSection() {
  return (
    <Section id="products" spacing="md" className="rounded-b-4xl sm:rounded-b-7xl relative mt-4 -mb-8 sm:-mb-18">
      <SectionHeading
        eyebrow={
          <Eyebrow icon={FlashIcon} className="text-sm font-normal">
            {PRODUCTS_INTRO.eyebrow}
          </Eyebrow>
        }
        title={PRODUCTS_INTRO.title}
        description={PRODUCTS_INTRO.body}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PRODUCTS.map((product) => {
          const tone = tones[product.tone];
          const media = productMedia[product.id];

          return (
            <article
              key={product.id}
              className={cn(
                "relative flex flex-col justify-between overflow-hidden rounded-3xl px-6 pt-6 md:pt-8 md:px-8",
                tone.card,
              )}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden"
              >
                <Image
                  src="/patterns/Vector 979.svg"
                  alt=""
                  fill
                  unoptimized
                  className="object-cover object-bottom opacity-30"
                />
              </div>

              <div className="relative z-10 flex flex-col items-start gap-4">
                <Eyebrow className={`${tone.pill} border ${tone.border} px-1.5 py-1 text-xs`}>
                  {product.eyebrow}
                </Eyebrow>
                <h3
                  className={`${tone.text} text-heading-md tracking-wide font-batica font-bold`}
                >
                  {product.title}
                </h3>
                <p className="text-base font-medium text-grey-600 h-17 line-clamp-3">
                  {product.body}
                </p>
                <Button size="md" className={cn("mt-2", tone.button)}>
                  {product.action}
                </Button>
              </div>

              <div className="relative z-10 mt-8 flex w-full justify-center">
                <div className="relative w-full max-w-11/12 overflow-hidden rounded-t-[2.2rem] border-[6px] border-b-0 border-black bg-black shadow-xl mb-0">
                  {media?.clip && (
                    <Image
                      src={media.clip}
                      alt={`${product.title} app screen`}
                      width={321}
                      height={323}
                      unoptimized
                      placeholder={SHIMMER}
                      className="w-full h-auto object-cover object-top rounded-t-[1.8rem]"
                    />
                  )}
                </div>

                {media?.pattern2 && (
                  <Image
                    src={media.pattern2}
                    alt=""
                    width={100}
                    height={100}
                    unoptimized
                    className={cn(
                      "absolute pointer-events-none z-20 h-auto",
                      media.patternPosition2,
                    )}
                  />
                )}

                {media?.pattern1 && (
                  <Image
                    src={media.pattern1}
                    alt=""
                    width={100}
                    height={100}
                    className={cn(
                      "absolute pointer-events-none z-30 h-auto",
                      media.patternPosition1,
                    )}
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
