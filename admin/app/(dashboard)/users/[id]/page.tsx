import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserDetail } from "@/components/users/user-detail";
import { USERS, findUser } from "@/content/users";

/** Pre-render every known user at build time. */
export function generateStaticParams() {
  return USERS.map((user) => ({ id: user.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/users/[id]">): Promise<Metadata> {
  const { id } = await params;
  const user = findUser(id);
  return { title: user ? user.displayName : "User not found" };
}

export default async function UserDetailPage({
  params,
}: PageProps<"/users/[id]">) {
  const { id } = await params;
  const user = findUser(id);
  if (!user) notFound();

  return <UserDetail user={user} />;
}
