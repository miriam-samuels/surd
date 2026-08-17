"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { BackToTop } from "@/components/ui/back-to-top";
import { FaqBrowser } from "@/components/sections/faqs/faq-browser";
import { FaqHero } from "@/components/sections/faqs/faq-hero";
import { FAQ_CATEGORIES } from "@/content/faqs";


export default function FaqsPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <FaqHero query={query} onQueryChange={setQuery} />

      <Container className="py-16 lg:py-20">
        <FaqBrowser categories={FAQ_CATEGORIES} query={query} />
        <div className="mt-12 flex justify-end">
          <BackToTop />
        </div>
      </Container>
    </>
  );
}
