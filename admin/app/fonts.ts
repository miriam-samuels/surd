import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

/**
 * SURD primary typeface.
 * Variable font covering 200–800, which spans every weight in the type scale
 * (Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800).
 */
export const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${plusJakartaSans.variable} ${geistMono.variable}`;
