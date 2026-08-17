import {
  ArrowDown01Icon,
  FlashIcon,
  InformationSquareIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/layout/section";
import { DownloadAppButton } from "@/components/ui/download-app-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { CALCULATOR } from "@/content/landing";
import { SHIMMER } from "@/lib/image-placeholder";

export function CalculatorSection() {
  return (
    <Section id="calculator" spacing="md">
      <SectionHeading
        eyebrow={<Eyebrow icon={FlashIcon}>{CALCULATOR.eyebrow}</Eyebrow>}
        title={CALCULATOR.title}
        description={CALCULATOR.body}
      />

      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Image
          src={CALCULATOR.image}
          alt={CALCULATOR.imageAlt}
          width={800}
          height={548}
          unoptimized
          placeholder={SHIMMER}
          className="h-full w-full rounded-3xl object-cover"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-1 flex-col justify-between gap-10 rounded-3xl bg-primary p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-md font-medium text-white/60">
                {CALCULATOR.amountLabel}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Pill>{CALCULATOR.frequencyLabel}</Pill>
                <Pill>{CALCULATOR.durationLabel}</Pill>
              </div>
            </div>

            <div className="flex items-end justify-between gap-6">
              <span className="flex-1 border-b border-white/25 pb-3 text-heading-md font-extrabold text-white sm:text-heading-lg">
                {CALCULATOR.amount}
              </span>
              <span className="flex shrink-0 items-center gap-1 pb-4 text-md font-medium text-white/60">
                {CALCULATOR.currency}
                <Icon icon={ArrowDown01Icon} size={18} />
              </span>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-[#fde65e] p-6 sm:p-8">
            <Sunburst />
            <span className="relative text-md font-medium text-yellow-800/70">
              {CALCULATOR.resultLabel}
            </span>
            <p className="relative flex items-center gap-2 text-heading-md font-extrabold text-grey-1000 sm:text-heading-lg">
              <span className="text-[0.6em]">₦</span>
              {CALCULATOR.result}
            </p>
          </div>

          <p className="flex items-start gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-500">
            <Icon
              icon={InformationSquareIcon}
              size={24}
              className="mt-px shrink-0"
            />
            {CALCULATOR.disclaimer}
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <h3 className="text-xl font-semibold sm:text-2xl">
          <span className="block text-grey-900">{CALCULATOR.footerTitle}</span>
          <span className="block text-grey-300">
            {CALCULATOR.footerTitleMuted}
          </span>
        </h3>
        <p className="max-w-2xl text-base font-medium text-grey-400">{CALCULATOR.footerBody}</p>
        <DownloadAppButton label={CALCULATOR.action} />
      </div>
    </Section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
      {children}
      <Icon icon={ArrowDown01Icon} size={16} />
    </span>
  );
}

function Sunburst() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 110 110"
      fill="none"
      className="pointer-events-none absolute -top-6 -right-10 size-56 text-white/50"
    >
      <path
        d="M55 0L62.7435 6.10943L71.9959 2.69189L77.4725 10.8952L87.3282 10.5041L90.0018 19.9982L99.4959 22.6718L99.1048 32.5275L107.308 38.0041L103.891 47.2565L110 55L103.891 62.7435L107.308 71.9959L99.1048 77.4725L99.4959 87.3282L90.0018 90.0018L87.3282 99.4959L77.4725 99.1048L71.9959 107.308L62.7435 103.891L55 110L47.2565 103.891L38.0041 107.308L32.5275 99.1048L22.6718 99.4959L19.9982 90.0018L10.5041 87.3282L10.8952 77.4725L2.69189 71.9959L6.10943 62.7435L0 55L6.10943 47.2565L2.69189 38.0041L10.8952 32.5275L10.5041 22.6718L19.9982 19.9982L22.6718 10.5041L32.5275 10.8952L38.0041 2.69189L47.2565 6.10943L55 0Z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
    </svg>
  );
}
