import { FlowerPotIcon } from "@hugeicons/core-free-icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HERO } from "@/content/landing";
import Image from "next/image";
import { STORES } from "@/components/ui/download-app-button";
import { cn } from "@/lib/cn";

export function HeroSection() {
  return (
    <Container
      className="relative overflow-hidden rounded-4xl pb-32 sm:pb-40"
      style={{
        backgroundImage:
          "url(/patterns/hero.png), linear-gradient(to bottom, transparent, var(--color-surd-blue-50))",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center pt-12 pb-8 text-center sm:pt-24">
        <Eyebrow className="text-sm font-normal" icon={FlowerPotIcon}>{HERO.eyebrow}</Eyebrow>

        <h1 className="mt-10 font-batica font-extrabold text-heading-md text-balance sm:text-heading-lg lg:text-heading-xl tracking-wide">
          <span className="text-grey-200">{HERO.titleMuted}</span>
          <br />
          <span className="text-grey-1000">{HERO.title}</span>
        </h1>

        <p className="mt-10 max-w-2xl text-base font-medium text-grey-400">
          {HERO.body}
        </p>

        <Button asChild size="lg" className="my-10 py-2">
          <a href="#download">
            {HERO.action}
            <span
              aria-hidden
              className={cn("h-5 w-px shrink-0 bg-white/30 h-6")}
            />
            <span className="flex shrink-0 items-center gap-2">
              {STORES.map((store) => (
                <Image
                  key={store.alt}
                  src={store.src}
                  alt={store.alt}
                  width={20}
                  height={20}
                  className="size-5"
                />
              ))}
            </span>
          </a>
        </Button>
      </div>
    </Container>
  );
}
