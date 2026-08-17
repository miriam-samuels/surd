import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Inline message block — the "Account suspended" notice on the login form and
 * anything else that needs to explain a state without interrupting the user.
 *
 *   <Alert tone="warning" title="Account suspended.">
 *     Please contact your admin for further assistance.
 *   </Alert>
 */

export const ALERT_TONES = ["info", "success", "warning", "danger"] as const;
export type AlertTone = (typeof ALERT_TONES)[number];

type ToneConfig = {
  surface: string;
  icon: string;
  glyph: IconSvgElement;
};

const tones: Record<AlertTone, ToneConfig> = {
  info: {
    surface: "border-surd-blue-100 bg-surd-blue-50",
    icon: "text-primary",
    glyph: InformationCircleIcon,
  },
  success: {
    surface: "border-green-150 bg-green-50",
    icon: "text-green-600",
    glyph: CheckmarkCircle02Icon,
  },
  warning: {
    surface: "border-orange-200 bg-orange-50",
    icon: "text-orange-500",
    glyph: Alert02Icon,
  },
  danger: {
    surface: "border-red-200 bg-red-50",
    icon: "text-red-500",
    glyph: Alert02Icon,
  },
};

type AlertProps = React.ComponentProps<"div"> & {
  tone?: AlertTone;
  title?: string;
};

export function Alert({
  tone = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const config = tones[tone];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        config.surface,
        className,
      )}
      {...props}
    >
      <Icon
        icon={config.glyph}
        size={18}
        className={cn("mt-0.5 shrink-0", config.icon)}
      />
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="text-sm font-bold text-grey-900">{title}</p>
        ) : null}
        {children ? (
          <p className="text-sm text-grey-600">{children}</p>
        ) : null}
      </div>
    </div>
  );
}
