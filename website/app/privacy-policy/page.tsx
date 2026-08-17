import type { Metadata } from "next";
import { LegalDocument } from "@/components/sections/legal/legal-document";
import { PRIVACY_POLICY } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SURD collects, uses and protects your information.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocument document={PRIVACY_POLICY} />;
}
