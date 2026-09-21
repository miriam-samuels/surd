"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  LIEN_QUERY,
  LIENS_QUERY,
  PLACE_LIEN_MUTATION,
  REPLACE_LIEN_MUTATION,
} from "@/api/liens/document";
import type { Lien, LienFilterInput, LienInput, LienUpdateInput } from "@/types/lien";

export const useLiens = createQuery<Lien[], LienFilterInput>({
  resolver: "liens",
  document: LIENS_QUERY,
  scope: "liens",
  paginated: true,
});

export const useLien = createQuery<Lien, LienFilterInput>({
  resolver: "lien",
  document: LIEN_QUERY,
  scope: "liens",
  key: (input) => ["detail", input?.lien_id ?? input?.savings_id],
  enabled: (input) => Boolean(input?.lien_id || input?.savings_id),
});

export const usePlaceLien = createMutation<Lien, LienInput>({
  resolver: "placeLien",
  document: PLACE_LIEN_MUTATION,
  success: "Lien placed.",
  invalidates: ["liens", "savings", "users"],
});

export const useReplaceLien = createMutation<Lien, LienUpdateInput>({
  resolver: "replaceLien",
  document: REPLACE_LIEN_MUTATION,
  success: "Lien updated.",
  invalidates: ["liens", "savings", "users"],
});
