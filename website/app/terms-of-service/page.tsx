import type { Metadata } from "next";
import { LegalDocument } from "@/components/sections/legal/legal-document";
import { TERMS_OF_SERVICE } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of SURD.",
};

export default function TermsOfServicePage() {
  return <LegalDocument document={TERMS_OF_SERVICE} />;
}
