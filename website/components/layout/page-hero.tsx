import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";

const tones = {
  brand: "bg-surd-blue-50 text-grey-900",
  dark: "bg-grey-1000 text-white",
} as const;

type PageHeroProps = {
  tone?: keyof typeof tones;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function PageHero({
  tone = "brand",
  eyebrow,
  title,
  meta,
  description,
  children,
  align = "left",
  className,
}: PageHeroProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn(isDark ? "bg-grey-1000" : "bg-white", className)}>
      <Container noPadding className={isDark ? "px-0 sm:px-0 lg:px-0 xl:px-0" : undefined}>
        <div
          className={cn(
            "relative overflow-hidden px-6 py-14 sm:px-12 sm:py-16 lg:py-22",
            isDark ? "rounded-none" : "rounded-4xl",
            tones[tone],
          )}
        >
          <div
            className={cn(
              "relative flex flex-col gap-6",
              align === "center" && "items-center text-center",
            )}
          >
            {eyebrow}
            <h1
              className={cn(
                "text-heading-md font-extrabold text-balance sm:text-heading-xl",
                isDark ? "text-white" : "text-surd-blue-900",
              )}
            >
              {title}
            </h1>
            {meta ? (
              <p
                className={cn(
                  "text-md font-semibold",
                  isDark ? "text-grey-400" : "text-surd-blue-400",
                )}
              >
                {meta}
              </p>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "max-w-2xl text-paragraph-md",
                  isDark ? "text-grey-400" : "text-grey-600",
                )}
              >
                {description}
              </p>
            ) : null}
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
