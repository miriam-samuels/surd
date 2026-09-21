import type { Metadata } from "next";
import { UserDetail } from "@/components/users/user-detail";

export const metadata: Metadata = { title: "User detail" };

/*
 * Rendered on demand rather than pre-generated: the id is a real account UUID,
 * so there is no finite set to enumerate at build time, and everything on the
 * page is per-request admin data behind a session anyway.
 */
export default async function UserDetailPage({
  params,
}: PageProps<"/users/[id]">) {
  const { id } = await params;
  return <UserDetail userId={id} />;
}
