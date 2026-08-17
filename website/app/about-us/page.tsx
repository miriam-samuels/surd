import type { Metadata } from "next";
import Link from "next/link";
import { CoreValuesSection } from "@/components/sections/about/core-values-section";
import { IntroCollageSection } from "@/components/sections/about/intro-collage-section";
import { VisionMissionSection } from "@/components/sections/about/vision-mission-section";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import {
  HIRING_CTA,
  OUR_STORY,
  TEAM,
  type TeamMember,
} from "@/content/about";
import { cn } from "@/lib/cn";
import { FlashIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Surd was created to help people save better, grow steadily, and manage money with more clarity and confidence.",
};

const memberTones: Record<TeamMember["tone"], string> = {
  aqua: "bg-aqua-400",
  blue: "bg-primary",
  pink: "bg-pink-400",
  yellow: "bg-yellow-400",
};

export default function AboutUsPage() {
  return (
    <>
      <IntroCollageSection />

      <VisionMissionSection />

      <CoreValuesSection />

      <Section tone="muted" spacing="md">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <h2 className="text-2xl font-semibold text-primary">
            {OUR_STORY.eyebrow}
          </h2>
          {OUR_STORY.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={cn(
                "text-xl font-semibold  sm:text-2xl",
                index === 0
                  ? "text-grey-900"
                  : "text-grey-500",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section spacing="md">
        <SectionHeading
          eyebrow={<Eyebrow icon={FlashIcon}>Meet the team</Eyebrow>}
          title={
            <>
              Created by those who value
              <br className="hidden sm:block" /> improved saving.
            </>
          }
        />

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, index) => (
            <li key={index} className="flex flex-col items-center gap-4">
              <div
                className={cn(
                  "grid size-40 place-items-center rounded-full p-3",
                  memberTones[member.tone],
                )}
              >
                <MediaPlaceholder
                  label={member.name}
                  aspect="aspect-square"
                  className="size-full rounded-full bg-grey-100"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-grey-900">{member.name}</p>
                <p className="text-xs text-grey-400">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Container className="flex flex-col gap-6 pb-20 sm:flex-row sm:items-center sm:justify-between lg:pb-28">
        <h2 className="max-w-xs text-2xl font-bold text-grey-900 sm:text-2xl">
          {HIRING_CTA.title}
        </h2>
        <Button asChild>
          <Link href="/careers">{HIRING_CTA.action}</Link>
        </Button>
      </Container>
    </>
  );
}
