import { AvatarLabel } from "@/components/ui/avatar-label";

/**
 * An admin in a table cell, for the rows where there may not be one.
 *
 * The audit log and the config table both return `""` rather than `null` for a
 * row nobody has touched or whose user record is gone, so an unguarded
 * `AvatarLabel` renders a blank chip that reads like a loading state. A dash
 * says "nothing here" out loud.
 */
export function PersonCell({
  name,
  email,
  avatar,
}: {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}) {
  const label = name?.trim();
  const address = email?.trim();

  if (!label && !address) return <span className="text-grey-400">—</span>;

  return (
    <AvatarLabel
      name={label || address!}
      caption={address}
      src={avatar?.trim() || undefined}
      size="sm"
      className="max-w-48"
    />
  );
}
