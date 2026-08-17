import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";

/**
 * Full-bleed hero band with the curved base and masked pattern shapes, used at
 * the top of the FAQ and job pages.
 *
 * The band is pulled up under the sticky header so the nav pill floats on top
 * of it, which is why it has to be the first thing a page renders.
 *
 *   <HeroBand tone="blue" eyebrow={…} title={job.title}>{…}</HeroBand>
 */

/** Written out in full — Tailwind scans source text, so built-up names never generate. */
const tones = {
  dark: {
    band: "bg-grey-1000",
    shape: "bg-grey-900",
    title: "text-white",
    muted: "text-grey-400",
  },
  /** Light band: the title carries the brand colour, text stays near-black. */
  blue: {
    band: "bg-surd-blue-100",
    shape: "bg-blue-100",
    title: "text-primary",
    muted: "text-grey-700",
  },
} as const;

export type HeroBandTone = keyof typeof tones;

type HeroBandProps = {
  tone?: HeroBandTone;
  /** Sits above the title: the FAQ icon tile, a role's location and type. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Anything below the description — a search field, a posted date. */
  children?: React.ReactNode;
  className?: string;
};

function HeroShape({
  src,
  tone,
  className,
}: {
  src: string;
  tone: HeroBandTone;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute",
        tones[tone].shape,
        className,
      )}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}

export function HeroBand({
  tone = "dark",
  eyebrow,
  title,
  description,
  children,
  className,
}: HeroBandProps) {
  const palette = tones[tone];

  return (
    <section
      className={cn(
        "relative -mt-28 overflow-hidden pt-28 sm:-mt-36 sm:pt-36",
        "rounded-b-[70%_6rem]",
        palette.band,
        className,
      )}
    >
      <HeroShape
        tone={tone}
        src="/patterns/soft-flower-full.svg"
        className="top-[34%] left-[80%] aspect-[74/48] w-32 sm:w-40"
      />
      <HeroShape
        tone={tone}
        src="/patterns/star-soft.svg"
        className="top-[37%] -left-24 aspect-square w-52"
      />
      {/* The space in the export's filename has to stay encoded — CSS `url()`
          drops the mask entirely if it is left raw. */}
      <HeroShape
        tone={tone}
        src="/patterns/Soft%20Flower.svg"
        className="-top-4 left-[12%] aspect-square w-20 sm:w-24"
      />
      <HeroShape
        tone={tone}
        src="/patterns/ellipse-67-arc.svg"
        className="top-[58%] left-[80%] aspect-[110/100] w-72 -scale-x-100 sm:w-[18rem]"
      />

      <Container className="relative flex flex-col items-center gap-6 pt-12 pb-8 text-center sm:pt-16 sm:pb-16">
        {eyebrow ? (
          <div className={cn("text-sm font-medium", palette.muted)}>
            {eyebrow}
          </div>
        ) : null}

        <h1
          className={cn(
            "text-heading-md font-batica font-bold text-balance sm:text-heading-lg",
            palette.title,
          )}
        >
          {title}
        </h1>

        {description ? (
          <p
            className={cn(
              "max-w-[39rem] text-paragraph-sm sm:text-paragraph-md",
              palette.muted,
            )}
          >
            {description}
          </p>
        ) : null}

        {children}
      </Container>
    </section>
  );
}
