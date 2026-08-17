import Image from "next/image";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/logo";
import { DownloadAppButton } from "@/components/ui/download-app-button";
import {
  FOOTER_COLUMNS,
  FOOTER_CTA,
  SOCIAL_LINKS,
  SUPPORT_EMAIL,
} from "@/content/nav";

export function SiteFooter() {
  return (
    <footer className="bg-grey-1000 px-4 py-12 sm:px-8 sm:py-16 lg:px-20 lg:py-25">
      <div className="mx-auto w-full max-w-[1352px] overflow-hidden rounded-3xl bg-grey-800">
        <FooterCta />
        <FooterSitemap />
      </div>
    </footer>
  );
}

function FooterCta() {
  return (
    <div className="relative overflow-hidden px-6 py-10 sm:px-12 sm:py-16 lg:px-20">
      <Image
        src="/patterns/surd-pattern.svg"
        alt=""
        aria-hidden
        width={786}
        height={514}
        className="pointer-events-none absolute -top-10 left-1/2 hidden w-[786px] max-w-none opacity-15 mix-blend-soft-light [mask-image:linear-gradient(to_left,#000_0%,#000_30%,transparent_88%)] lg:block"
      />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-1 flex-col gap-4">
          <h2 className="max-w-[433px] text-heading-sm font-bold text-white sm:text-heading-md">
            {FOOTER_CTA.title}
          </h2>
          <p className="max-w-[448px] text-md font-medium text-grey-400">
            {FOOTER_CTA.body}
          </p>
        </div>
        <DownloadAppButton
          label={FOOTER_CTA.action}
          size="lg"
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}

function FooterSitemap() {
  return (
    <div className="relative rounded-3xl bg-grey-950 p-6 sm:p-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <FooterWaves />
      </div>

      <Image
        src="/patterns/footer-star-front.svg"
        alt=""
        aria-hidden
        width={110}
        height={110}
        className="pointer-events-none absolute top-3 left-3 z-10 size-[110px]"
      />
      <Image
        src="/patterns/footer-star-back.svg"
        alt=""
        aria-hidden
        width={110}
        height={110}
        className="pointer-events-none absolute top-0 left-0 z-10 size-[110px]"
      />

      <div className="relative flex flex-col gap-10 rounded-2xl border border-dashed border-grey-700 px-6 pt-24 pb-30 sm:px-10 lg:flex-row lg:gap-20">
        <div className="flex w-full flex-col gap-10 lg:w-[400px]">
          <div className="flex items-end gap-4">
            <LogoMark />
            <Wordmark />
            <span className="sr-only">SURD</span>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-grey-200">CONTACT US</h3>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="w-fit text-sm font-semibold text-aqua-500 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <ul className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="grid size-14 place-items-center rounded-xl bg-grey-800 transition-colors hover:bg-grey-700"
                  >
                    <Image
                      src={social.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-6">
              <h3 className="text-sm font-bold uppercase text-grey-200">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-grey-500 transition-colors hover:text-grey-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterWaves() {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0">
      <Image
        src="/patterns/stream.svg"
        alt=""
        width={1468}
        height={139}
        className="relative left-0 w-full max-w-none"
      />
    </div>
  );
}
