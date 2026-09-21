import type { ContentPlatform } from "@/types/enum";
import type { PageRequest } from "@/types/filters";
import type { User } from "@/types/user";

export interface AdminContent {
  id: string;

  /** What the client apps look copy up by — never the mutation target. */
  key: string;
  platform: ContentPlatform;
  title: string;
  placement: string;

  /** Disabled rows still show here; they are hidden from the client apps. */
  enabled: boolean;

  /** Both are `String!` — `""` when unset, never null. */
  english: string;
  french: string;
  updated_by_id: string | null;

  /** Federated, and null when the admin record was removed. */
  updated_by?: Pick<
    User,
    "id" | "firstname" | "lastname" | "email" | "avatar"
  > | null;
  updated_at: string | null;
}

export interface AdminContentsFilterInput extends PageRequest {
  search?: string;

  /** The tab. Switching tabs is a refetch, not a client-side filter. */
  platform?: ContentPlatform;
  placement?: string;
  paginate?: boolean;
}

export interface AdminContentInput {
  content_id: string;
}

export interface AdminCreateContentInput {
  key: string;
  platform: ContentPlatform;
  title: string;
  placement: string;
  english: string;
  french: string;

  /** Defaults to `true`. */
  enabled?: boolean;
}

/**
 * Only what you send is written. Sending nothing but `content_id` is a 400, and
 * echoing back `title` / `placement` would overwrite someone else's edit — the
 * modal does not show them, so it must not send them.
 */
export interface AdminUpdateContentInput {
  content_id: string;
  english?: string;
  french?: string;
  title?: string;
  placement?: string;
}

export interface AdminSetContentStatusInput {
  content_id: string;
  enabled: boolean;
}
