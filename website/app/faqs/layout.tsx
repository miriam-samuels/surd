import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to the questions we hear most about saving, security, interest and withdrawals.",
};

export default function FaqsLayout({ children }: LayoutProps<"/faqs">) {
  return children;
}
