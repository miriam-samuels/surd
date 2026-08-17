import { Container, type ContainerWidth } from "@/components/layout/container";
import { cn } from "@/lib/cn";

const tones = {
  white: "bg-white text-grey-900",
  muted: "bg-grey-25 text-grey-900",
  dark: "bg-grey-1000 text-white",
  brand: "bg-surd-blue-50 text-grey-900",
} as const;

const spacings = {
  none: "",
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
} as const;

type SectionProps = React.ComponentProps<"section"> & {
  tone?: keyof typeof tones;
  spacing?: keyof typeof spacings;
  width?: ContainerWidth;
  bleed?: boolean;
  noPadding?: boolean;
};

export function Section({
  tone = "white",
  spacing = "md",
  width = "default",
  bleed = false,
  noPadding = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(tones[tone], spacings[spacing], className)}
      {...props}
    >
      {bleed ? children : <Container width={width} noPadding>{children}</Container>}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow}
      <h2 className="max-w-4xl font-batica tracking-wide text-heading-sm font-extrabold text-balance sm:text-heading-lg">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-paragraph-md text-grey-400 font-medium">
          {description}
        </p>
      ) : null}
    </div>
  );
}
