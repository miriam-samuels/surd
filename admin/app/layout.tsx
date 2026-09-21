import type { Metadata } from "next";
import { connection } from "next/server";
import { fontVariables } from "./fonts";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "SURD Admin",
  description: "SURD admin dashboard",
};

/*
 * Async and awaiting the request so every route renders per request: the CSP
 * nonce only exists at request time, and a page prerendered at build carries
 * no nonce, so its scripts would be blocked and it would never hydrate.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  await connection();

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
