"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Avatar, type AvatarSize } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * A row of overlapping avatars.
 *
 * Pass the full list of people; `max` controls how many render before the rest
 * collapse into a "+N" chip. Setting `onAdd` appends a dashed add button.
 *
 *   <AvatarGroup people={team} max={5} size="md" onAdd={invite} />
 */

export type AvatarGroupPerson = {
  name: string;
  src?: string;
};

/** Overlap and ring thickness scale with the avatar so the row stays even. */
const overlaps: Record<AvatarSize, string> = {
  xs: "-ml-2",
  sm: "-ml-2.5",
  md: "-ml-3",
  lg: "-ml-3.5",
  xl: "-ml-4",
  "2xl": "-ml-5",
};

const chipSizes: Record<AvatarSize, { box: number; text: string }> = {
  xs: { box: 24, text: "text-2xs" },
  sm: { box: 32, text: "text-2xs" },
  md: { box: 40, text: "text-xs" },
  lg: { box: 48, text: "text-sm" },
  xl: { box: 56, text: "text-md" },
  "2xl": { box: 64, text: "text-lg" },
};

type AvatarGroupProps = Omit<React.ComponentProps<"div">, "children"> & {
  people: AvatarGroupPerson[];
  size?: AvatarSize;
  /** How many avatars to show before collapsing the remainder into "+N". */
  max?: number;
  /** Renders a dashed add button after the group when provided. */
  onAdd?: () => void;
  addLabel?: string;
};

export function AvatarGroup({
  people,
  size = "md",
  max = people.length,
  onAdd,
  addLabel = "Add person",
  className,
  ...props
}: AvatarGroupProps) {
  const visible = people.slice(0, max);
  const overflow = people.length - visible.length;
  const { box, text } = chipSizes[size];

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {visible.map((person, index) => (
        <Avatar
          key={`${person.name}-${index}`}
          name={person.name}
          src={person.src}
          size={size}
          className={cn(
            "rounded-full ring-2 ring-white",
            index > 0 && overlaps[size],
          )}
        />
      ))}

      {overflow > 0 ? (
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-full ring-2 ring-white",
            "bg-surd-blue-50 font-bold text-surd-blue-500",
            overlaps[size],
            text,
          )}
          style={{ width: box, height: box }}
        >
          +{overflow}
        </span>
      ) : null}

      {onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          aria-label={addLabel}
          title={addLabel}
          className={cn(
            "ml-2 grid shrink-0 place-items-center rounded-full border border-dashed",
            "border-grey-150 text-grey-300 transition-colors outline-none",
            "hover:border-grey-300 hover:text-grey-500",
            "focus-visible:shadow-ring-gray",
          )}
          style={{ width: box, height: box }}
        >
          <Icon icon={PlusSignIcon} size={Math.round(box * 0.4)} />
        </button>
      ) : null}
    </div>
  );
}
