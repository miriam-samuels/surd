"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  CREATE_PRODUCT_MUTATION,
  CREATE_TARGET_PLAN_TEMPLATE_MUTATION,
  DELETE_PRODUCT_MUTATION,
  DELETE_TARGET_PLAN_TEMPLATE_MUTATION,
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
  TARGET_PLAN_TEMPLATE_QUERY,
  TARGET_PLAN_TEMPLATES_QUERY,
  UPDATE_PRODUCT_MUTATION,
  UPDATE_TARGET_PLAN_TEMPLATE_MUTATION,
} from "@/api/products/document";
import type { TargetPlanTemplateFilterInput } from "@/types/filters";
import type {
  Product,
  ProductFilterInput,
  ProductInput,
  ProductUpdateInput,
  TargetPlanTemplate,
  TargetPlanTemplateInput,
  UpdateTargetPlanTemplateInput,
} from "@/types/product";

export const useProducts = createQuery<Product[]>({
  resolver: "products",
  document: PRODUCTS_QUERY,
  scope: "products",
  staleTime: 5 * 60_000,
});

export const useProduct = createQuery<Product, ProductFilterInput>({
  resolver: "product",
  document: PRODUCT_QUERY,
  scope: "products",
  key: (input) => ["detail", input?.product_id ?? input?.id ?? input?.code],
  enabled: (input) => Boolean(input?.product_id || input?.id || input?.code),
});

export const useCreateProduct = createMutation<Product, ProductInput>({
  resolver: "create",
  document: CREATE_PRODUCT_MUTATION,
  success: "Product created.",
  invalidates: ["products", "savings", "metrics"],
});

export const useUpdateProduct = createMutation<Product, ProductUpdateInput>({
  resolver: "update",
  document: UPDATE_PRODUCT_MUTATION,
  success: "Product updated.",
  invalidates: ["products", "savings", "metrics"],
});

export const useDeleteProduct = createMutation<null, ProductUpdateInput>({
  resolver: "delete",
  document: DELETE_PRODUCT_MUTATION,
  success: "Product removed.",
  invalidates: ["products", "savings", "metrics"],
});

export const useTargetPlanTemplates = createQuery<
  TargetPlanTemplate[],
  TargetPlanTemplateFilterInput
>({
  resolver: "targetPlanTemplates",
  document: TARGET_PLAN_TEMPLATES_QUERY,
  scope: "templates",
  staleTime: 5 * 60_000,
  paginated: true,
});

export const useTargetPlanTemplate = createQuery<TargetPlanTemplate, string>({
  resolver: "targetPlanTemplate",
  document: TARGET_PLAN_TEMPLATE_QUERY,
  scope: "templates",
  key: (id) => ["detail", id],
  enabled: (id) => Boolean(id),
});

export const useCreateTargetPlanTemplate = createMutation<
  TargetPlanTemplate,
  TargetPlanTemplateInput
>({
  resolver: "createTargetPlanTemplate",
  document: CREATE_TARGET_PLAN_TEMPLATE_MUTATION,
  success: "Template created.",
  invalidates: ["templates"],
});

export const useUpdateTargetPlanTemplate = createMutation<
  TargetPlanTemplate,
  UpdateTargetPlanTemplateInput
>({
  resolver: "updateTargetPlanTemplate",
  document: UPDATE_TARGET_PLAN_TEMPLATE_MUTATION,
  success: "Template updated.",
  invalidates: ["templates"],
});

export const useDeleteTargetPlanTemplate = createMutation<null, string>({
  resolver: "deleteTargetPlanTemplate",
  document: DELETE_TARGET_PLAN_TEMPLATE_MUTATION,
  success: "Template removed.",
  invalidates: ["templates"],
});
