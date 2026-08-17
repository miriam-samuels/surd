import Image from "next/image";
import { Container } from "@/components/layout/container";
import { DownloadAppButton } from "@/components/ui/download-app-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { WHY_SURD } from "@/content/landing";
import { SHIMMER_DARK } from "@/lib/image-placeholder";
import { FlashIcon } from "@hugeicons/core-free-icons";

const CARD =
  "relative flex flex-col overflow-hidden rounded-3xl bg-grey-900 p-6 sm:p-9";
const CARD_TITLE =
  "font-batica font-extrabold tracking-wide mb-2";
const CARD_BODY = "mt-2 text-base font-medium text-grey-400";

export function WhySurdSection() {
  return (
    <section className="bg-grey-1000 py-20 sm:py-30 lg:py-40">
      <Container noPadding>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <Eyebrow tone="dark" icon={FlashIcon} className="bg-blue-900 text-surd-blue-100 text-sm">
              {WHY_SURD.eyebrow}
            </Eyebrow>
            <h2 className="font-batica text-heading-md font-extrabold tracking-wide whitespace-pre-line text-white sm:text-heading-lg">
              {WHY_SURD.title}
            </h2>
          </div>
          <DownloadAppButton label={WHY_SURD.action} />
        </div>

        <div className="mt-12 grid gap-5 lg:aspect-[2/1] lg:grid-cols-[1.31fr_1fr_1fr] lg:grid-rows-[0.755fr_1fr]">
          <article className={`${CARD} min-h-[480px] lg:row-span-2 lg:min-h-[610px]`}>
            <div className="pointer-events-none relative -mt-2 w-full max-w-[320px] self-center lg:absolute lg:top-1 lg:left-1/2 lg:mt-0 lg:w-[103%] lg:max-w-none lg:-translate-x-1/2">
              <Image
                src="/clips/916shots_so 1.svg"
                alt="Auto-save settings screen"
                width={518}
                height={530}
                unoptimized
                placeholder={SHIMMER_DARK}
                className="relative h-auto w-full z-20"
              />

              <Image
                src="/patterns/star-badge-aqua.svg"
                alt=""
                width={120}
                height={120}
                unoptimized
                className="absolute right-[3.4%] bottom-[15%] z-10 h-auto w-[24%] rotate-[180deg]"
              />
            </div>

            <Image
              src="/patterns/ellipse-67-arc.svg"
              alt=""
              width={110}
              height={100}
              unoptimized
              className="pointer-events-none absolute -bottom-8 -left-4 z-10 h-auto w-22"
            />

            <div className="relative z-20 mt-auto">
              <h3 className={`${CARD_TITLE} !text-[2.3rem] leading-10`}>
                <span className="text-white ">Less thinking.</span>
                <br />
                <span className="text-grey-500">More saving.</span>
              </h3>
              <p className={CARD_BODY}>
                Automate your savings and spend less
                <br />
                time remembering.
              </p>
            </div>
          </article>

          <article className={`${CARD} min-h-[280px]`}>
            <Image
              src="/patterns/SURD PATTERNAsset 3 1.svg"
              alt=""
              width={396}
              height={197}
              unoptimized
              className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full opacity-10"
            />

            <Image
              src="/patterns/soft-flower-full.svg"
              alt=""
              width={84}
              height={84}
              unoptimized
              className="pointer-events-none absolute -top-5 -right-6 z-10 h-24 w-24"
            />

            <h3 className={`${CARD_TITLE} !text-[1.6rem] leading-8 relative z-20`}>
              <span className="text-white">Progress</span>
              <br />
              <span className="text-grey-500">over perfection.</span>
            </h3>

            <p className={`${CARD_BODY} relative z-20 mt-auto pt-6`}>
              Missed a week? That&apos;s okay.
              <br />
              Just keep going.
            </p>
          </article>

          <article className={`${CARD} min-h-[330px]`}>
            <div className="relative pointer-events-none h-36 mx-6 overflow-hidden sm:-mx-8 ">
              <Image
                src="/patterns/frames.svg"
                alt="Plan settings options"
                fill
                unoptimized
                placeholder={SHIMMER_DARK}
                className="h-auto  max-w-none object-cover [mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_88%)]"
              />
            </div>

            <div className="relative z-20 mt-auto pt-6">
              <h3 className={`${CARD_TITLE} !text-[1.6rem] leading-8 relative z-20`}>
                <span className="text-white">Designed around</span>
                <br />
                <span className="text-grey-500">real life.</span>
              </h3>
              <p className={CARD_BODY}>
                Plans change. Goals change.
                <br />
                Your savings should be flexible too.
              </p>
            </div>
          </article>

          <article
            className={`${CARD} min-h-[520px] lg:row-span-2 lg:col-start-3 lg:row-start-1 lg:min-h-0`}
          >
            <Image
              src="/clips/Mask group.svg"
              alt="Celebrating customer"
              fill
              unoptimized
              placeholder={SHIMMER_DARK}
              className="object-cover object-top"
            />

            <Image
              src="/patterns/ellipse-67-arc.svg"
              alt=""
              width={110}
              height={100}
              unoptimized
              className="pointer-events-none absolute -bottom-6 -right-4 z-10 h-auto w-22 rotate-[270deg] grayscale-100"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-grey-900 via-grey-900/80 to-transparent" />

            <div className="absolute inset-x-4 top-[58%] z-20 rounded-2xl border border-dashed border-grey-200 p-1.5 ">
              <div className="flex items-center gap-2 rounded-xl bg-white p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surd-blue-500 text-white">
                  <Image
                    src="/patterns/notification-bell.svg"
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </span>
                <p className="text-[13px] leading-[1.35] text-grey-900">
                  Adding <span className="font-bold">$50</span> today will bring
                  you to <span className="font-bold">85%</span> of your
                  &apos;Dream House&apos; goal.
                </p>
              </div>
            </div>

            <div className="relative z-20 mt-auto">
              <h3 className={`${CARD_TITLE} !text-[2.3rem] leading-10`}>
                <span className="text-white">Celebrate</span>
                <br />
                <span className="text-grey-500">consistency.</span>
              </h3>
              <p className={CARD_BODY}>
                Big balances don&apos;t happen overnight.
                <br />
                Good habits do.
              </p>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
