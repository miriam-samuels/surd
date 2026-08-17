import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { BackToTop } from "@/components/ui/back-to-top";
import {
  TableOfContents,
  type TocEntry,
} from "@/components/ui/table-of-contents";
import type { LegalDocument as LegalDocumentData } from "@/content/legal";


export function LegalDocument({ document }: { document: LegalDocumentData }) {
  const toc: TocEntry[] = document.sections.map((section, index) => ({
    id: section.id,
    label: `${index + 1}. ${section.title}`,
    children: section.subsections?.map((sub) => ({
      id: sub.id,
      label: sub.title,
    })),
  }));

  return (
    <>
      <PageHero
        title={document.title}
        meta={document.updatedLabel}
        className="pt-4 pb-8 sm:pb-12"
      />

      <Container noPadding className="py-20 lg:py-28">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <aside className="lg:w-64 lg:shrink-0">
            <TableOfContents entries={toc} className="lg:sticky lg:top-28" />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-12">
            {document.sections.map((section, index) => (
              <article
                key={section.id}
                id={section.id}
                className="flex scroll-mt-28 flex-col gap-4"
              >
                <h2 className="text-heading-xs font-bold text-grey-900">
                  <span className="mr-2 tabular-nums">{index + 1}.</span>
                  {section.title}
                </h2>

                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-paragraph-md text-grey-500">
                    {paragraph}
                  </p>
                ))}

                {section.subsections?.map((sub) => (
                  <div
                    key={sub.id}
                    id={sub.id}
                    className="flex scroll-mt-28 flex-col gap-2 pt-2"
                  >
                    <h3 className="text-md font-bold text-grey-900">
                      {sub.title}
                    </h3>
                    {sub.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-paragraph-md text-grey-500"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </article>
            ))}

            <div className="flex justify-end">
              <BackToTop />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
