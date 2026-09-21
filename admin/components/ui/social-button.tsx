import {
  Facebook01Icon,
  FigmaIcon,
  Github01Icon,
  GoogleIcon,
  Linkedin01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export const SOCIAL_PROVIDERS = [
  "facebook",
  "twitter",
  "linkedin",
  "google",
  "figma",
  "github",
] as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

type ProviderConfig = {
  label: string;
  icon: IconSvgElement;

  solid: string;

  accent: string;
};

const providers: Record<SocialProvider, ProviderConfig> = {
  facebook: {
    label: "Facebook",
    icon: Facebook01Icon,
    solid: "bg-[#1877F2] hover:bg-[#1465D2]",
    accent: "text-[#1877F2]",
  },
  twitter: {
    label: "Twitter",
    icon: NewTwitterIcon,
    solid: "bg-grey-1000 hover:bg-grey-800",
    accent: "text-grey-1000",
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin01Icon,
    solid: "bg-[#0A66C2] hover:bg-[#0857A6]",
    accent: "text-[#0A66C2]",
  },
  google: {
    label: "Google",
    icon: GoogleIcon,
    solid: "bg-grey-1000 hover:bg-grey-800",
    accent: "text-grey-1000",
  },
  figma: {
    label: "Figma",
    icon: FigmaIcon,
    solid: "bg-grey-1000 hover:bg-grey-800",
    accent: "text-grey-1000",
  },
  github: {
    label: "Github",
    icon: Github01Icon,
    solid: "bg-grey-1000 hover:bg-grey-800",
    accent: "text-grey-1000",
  },
};

export type SocialButtonVariant = "solid" | "outline";

type SocialButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
  provider: SocialProvider;
  variant?: SocialButtonVariant;

  iconOnly?: boolean;

  label?: string;
  block?: boolean;
};

export function SocialButton({
  provider,
  variant = "solid",
  iconOnly = false,
  label,
  block = false,
  className,
  ...props
}: SocialButtonProps) {
  const config = providers[provider];
  const text = label ?? `Sign In With ${config.label}`;

  return (
    <button
      type="button"
      aria-label={iconOnly ? text : undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        "text-sm transition-colors outline-none focus-visible:shadow-ring-gray",
        "disabled:pointer-events-none disabled:opacity-40",
        iconOnly ? "size-10" : "h-10 gap-2.5 px-4",
        variant === "solid"
          ? cn("text-white", config.solid)
          : cn(
              "border border-grey-100 bg-white text-grey-900 hover:bg-grey-25",
              config.accent,
            ),
        block && !iconOnly && "w-full",
        className,
      )}
      {...props}
    >
      <Icon icon={config.icon} size={18} />
      {iconOnly ? null : (
        <span className={variant === "outline" ? "text-grey-900" : undefined}>
          {text}
        </span>
      )}
    </button>
  );
}
