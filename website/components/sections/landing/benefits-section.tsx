import {
  ArrowRight02Icon,
  ChartLineDataIcon,
  CircleLock02Icon,
  CoinsEuroIcon,
  CreditCardPosIcon,
  FlashIcon,
  Recycle03Icon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { BENEFITS, BENEFITS_INTRO } from "@/content/landing";
import { SHIMMER } from "@/lib/image-placeholder";


const CHIPS = {
  "auto-save": {
    icon: Recycle03Icon,
    className: "bg-orange-50 text-orange-500",
  },
  "multi-currency": { icon: CoinsEuroIcon, className: "bg-aqua-50 text-aqua-600" },
  "flexible-withdrawal": {
    icon: Wallet03Icon,
    className: "bg-surd-blue-50 text-surd-blue-500",
  },
  "withdraw-anytime": {
    icon: CreditCardPosIcon,
    className: "bg-green-50 text-green-500",
  },
  "smart-reminders": {
    icon: CircleLock02Icon,
    className: "bg-pink-50 text-pink-500",
  },
  "track-progress": {
    icon: ChartLineDataIcon,
    className: "bg-red-50 text-red-500",
  },
} as const;

export function BenefitsSection() {
  return (
    <Section spacing="md">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-5">
          <Eyebrow icon={FlashIcon}>{BENEFITS_INTRO.eyebrow}</Eyebrow>
          <h2 className="max-w-2xl text-heading-sm font-extrabold text-balance sm:text-heading-lg">
            {BENEFITS_INTRO.title}
          </h2>
        </div>

        <aside className="flex max-w-lg items-center gap-4 rounded-2xl bg-grey-10 p-4 border border-dashed border-grey-100">
          <Image
            src="/patterns/sec.svg"
            alt="SEC Nigeria & Security"
            width={111}
            height={54}
            unoptimized
            placeholder={SHIMMER}
            className="h-auto w-[111px] shrink-0"
          />
          <p className="text-sm text-grey-500">{BENEFITS_INTRO.aside}</p>
          <span className="ml-auto shrink-0 text-primary">
            <Icon icon={ArrowRight02Icon} size={20} strokeWidth={2}/>

          </span>
        </aside>
      </div>

      <ul className="mt-12 grid border-t border-l border-dashed border-grey-100 sm:grid-cols-2 lg:grid-cols-3 rounded-4xl">
        {BENEFITS.map((benefit) => {
          const chip = CHIPS[benefit.id as keyof typeof CHIPS];

          return (
            <li
              key={benefit.id}
              className="flex flex-col border-r border-b border-dashed border-grey-100 p-7"
            >
              <span
                className={`grid size-10 place-items-center rounded-xl ${chip.className}`}
              >
                <Icon icon={chip.icon} size={24}  strokeWidth={2}/>
              </span>

              <h3 className="mt-9 text-md font-bold text-grey-900">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm text-grey-400">{benefit.body}</p>

              <Image
                src={benefit.illustration}
                alt={benefit.media}
                width={355}
                height={288}
                unoptimized
                placeholder={SHIMMER}
                className="mx-auto mt-auto h-auto w-[88%] max-w-[355px] pt-10"
              />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
