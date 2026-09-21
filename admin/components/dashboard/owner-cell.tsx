import Link from "next/link";
import { AvatarLabel } from "@/components/ui/avatar-label";
import { ROUTES } from "@/constants/routes";

export function OwnerCell({
  name,
  email,
  userId,
}: {
  name: string;
  email: string;
  userId?: string;
}) {
  const label = (
    <AvatarLabel name={name} caption={email} size="sm" className="max-w-48" />
  );

  if (!userId) return label;

  return (
    <Link
      href={ROUTES.users.detail(userId)}
      className="block rounded-lg outline-none focus-visible:shadow-ring-primary"
    >
      {label}
    </Link>
  );
}
