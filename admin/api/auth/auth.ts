"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_LOGIN_MUTATION,
  ADMIN_VERIFY_LOGIN_MUTATION,
  PROFILE_QUERY,
} from "@/api/auth/document";
import type {
  AdminLoginChallenge,
  AdminLoginInput,
  AdminVerifyLoginInput,
} from "@/types/auth";
import type { User } from "@/types/user";

export const useAdminLogin = createMutation<AdminLoginChallenge, AdminLoginInput>({
  resolver: "adminLogin",
  document: ADMIN_LOGIN_MUTATION,
  success: false,
});

export const useAdminVerifyLogin = createMutation<User, AdminVerifyLoginInput>({
  resolver: "adminVerifyLogin",
  document: ADMIN_VERIFY_LOGIN_MUTATION,
  success: false,
});

export const useProfile = createQuery<User>({
  resolver: "profile",
  document: PROFILE_QUERY,
  scope: "session",
  staleTime: 5 * 60_000,
});
