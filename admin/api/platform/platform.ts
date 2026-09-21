"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_PLATFORM_CONFIG_KEYS_QUERY,
  MODIFY_PLATFORM_CONFIG_MUTATION,
  PLATFORM_CONFIG_QUERY,
} from "@/api/platform/document";
import type {
  AdminPlatformConfigKey,
  PlatformConfig,
  PlatformConfigInput,
} from "@/types/platform";

export const usePlatformConfig = createQuery<PlatformConfig>({
  resolver: "platformConfig",
  document: PLATFORM_CONFIG_QUERY,
  scope: "platform",

  staleTime: 5 * 60_000,
});

export const useAdminPlatformConfigKeys = createQuery<AdminPlatformConfigKey[]>({
  resolver: "adminPlatformConfigKeys",
  document: ADMIN_PLATFORM_CONFIG_KEYS_QUERY,
  scope: "platform",
  staleTime: 5 * 60_000,
});

export const useModifyPlatformConfig = createMutation<
  PlatformConfig,
  PlatformConfigInput
>({
  resolver: "modifyPlatformConfig",
  document: MODIFY_PLATFORM_CONFIG_MUTATION,
  success: "Platform configuration updated.",
  invalidates: ["platform", "metrics"],
});
