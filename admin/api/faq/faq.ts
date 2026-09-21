"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  CREATE_FAQ_MUTATION,
  DELETE_FAQ_MUTATION,
  FAQ_QUERY,
  FAQS_QUERY,
  UPDATE_FAQ_MUTATION,
} from "@/api/faq/document";
import type { FaqFilterInput } from "@/types/filters";
import type { Faq, FaqInput, UpdateFaqInput } from "@/types/faq";

export const useFaqs = createQuery<Faq[], FaqFilterInput>({
  resolver: "faqs",
  document: FAQS_QUERY,
  scope: "faqs",
  staleTime: 5 * 60_000,
  paginated: true,
});

export const useFaq = createQuery<Faq, string>({
  resolver: "faq",
  document: FAQ_QUERY,
  scope: "faqs",
  key: (id) => ["detail", id],
  enabled: (id) => Boolean(id),
});

export const useCreateFaq = createMutation<Faq, FaqInput>({
  resolver: "createFAQ",
  document: CREATE_FAQ_MUTATION,
  success: "FAQ published.",
  invalidates: ["faqs"],
});

export const useUpdateFaq = createMutation<Faq, UpdateFaqInput>({
  resolver: "updateFAQ",
  document: UPDATE_FAQ_MUTATION,
  success: "FAQ updated.",
  invalidates: ["faqs"],
});

export const useDeleteFaq = createMutation<null, string>({
  resolver: "deleteFAQ",
  document: DELETE_FAQ_MUTATION,
  success: "FAQ removed.",
  invalidates: ["faqs"],
});
