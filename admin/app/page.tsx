import { redirect } from "next/navigation";

/** The console has no public landing page — send people to sign in. */
export default function RootPage() {
  redirect("/login");
}
