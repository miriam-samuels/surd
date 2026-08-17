import { BinocularsIcon, Target01Icon } from "@hugeicons/core-free-icons";
import { Container } from "@/components/layout/container";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { MISSION, OUR_STORY, VISION } from "@/content/about";
import { cn } from "@/lib/cn";

const WATERMARK = {
  backgroundImage: "url(/patterns/surd-pattern.svg)",
  backgroundSize: "470px 308px",
  backgroundRepeat: "repeat",
} satisfies React.CSSProperties;

const WATERMARK_FADE =
  "linear-gradient(to top, transparent 0%, black 30%, black 70%, transparent 100%)";

const CARD =
  "group relative isolate flex min-h-64 flex-col justify-between gap-10 overflow-hidden rounded-3xl p-6 sm:p-8 lg:min-h-76";

function CardEyebrow({
  icon,
  pill,
  bullet,
  children,
}: {
  icon: IconSvgElement;
  pill: string;
  bullet: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full py-1 pr-4 pl-1",
        "text-label-sm text-white uppercase",
        pill,
      )}
    >
      <span className={cn("grid size-7 place-items-center rounded-full", bullet)}>
        <Icon icon={icon} size={16} />
      </span>
      {children}
    </span>
  );
}

function CardDetail({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 text-base font-medium leading-relaxed text-white/80",
        "absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8",
        "translate-y-4 opacity-0 transition-all duration-300 ease-out",
        "group-hover:translate-y-0 group-hover:opacity-100",
        className,
      )}
    >
      {OUR_STORY.paragraphs.slice(0, 2).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function VisionMissionSection() {
  return (
    <section className="py-12 sm:py-16">
      <Container noPadding>
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          <article className={cn(CARD, "bg-surd-blue-500")}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
              style={{
                ...WATERMARK,
                maskImage: WATERMARK_FADE,
                WebkitMaskImage: WATERMARK_FADE,
              }}
            />
            <CardEyebrow
              icon={BinocularsIcon}
              pill="bg-surd-blue-700"
              bullet="bg-surd-blue-500"
            >
              {VISION.eyebrow}
            </CardEyebrow>
            <p className="font-batica text-2xl font-extrabold tracking-wide text-white/55 transition-opacity duration-300 group-hover:opacity-0 sm:text-heading-sm">
              {VISION.lead} <span className="text-white">{VISION.body}</span>
            </p>
            <CardDetail />
          </article>

          <article className={cn(CARD, "bg-grey-1000")}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
              style={{
                ...WATERMARK,
                maskImage: WATERMARK_FADE,
                WebkitMaskImage: WATERMARK_FADE,
              }}
            />
            <CardEyebrow
              icon={Target01Icon}
              pill="bg-grey-850"
              bullet="bg-surd-blue-500"
            >
              {MISSION.eyebrow}
            </CardEyebrow>
            <p className="font-batica text-2xl font-extrabold tracking-wide text-grey-500 transition-opacity duration-300 group-hover:opacity-0 sm:text-heading-sm">
              {MISSION.lead} <span className="text-white">{MISSION.body}</span>{" "}
              {MISSION.tail}
            </p>
            <CardDetail />
          </article>
        </div>
      </Container>
    </section>
  );
}
