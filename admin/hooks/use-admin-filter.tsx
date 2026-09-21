"use client";

import { useAdminAccounts } from "@/api";
import { Avatar } from "@/components/ui/avatar";
import type { FilterGroup } from "@/components/ui/table-controls";
import { formatName } from "@/lib/format";

/**
 * Enough to cover a staff list several times over. Admin accounts are a
 * handful of people, not a customer table, so this is one request rather than a
 * paginated picker — and `paginate: false` asks the server for the set instead
 * of a page of it.
 */
const ADMIN_LIMIT = 100;

/**
 * The "Authorized by" filter group, populated from `adminAccounts`.
 *
 * It lists **everyone who can authorise**, not the names that happen to appear
 * in the current page of rows. Deriving the options from the visible rows would
 * make the filter useless for its one purpose: finding the movements of an
 * admin who is not on page one.
 *
 * Suspended accounts stay in the list on purpose. Someone who authorised a
 * capital movement in March is exactly who an admin wants to filter by when
 * that account is later suspended, and dropping them would quietly hide the
 * movements most worth reviewing.
 *
 * @param field the key the caller reads back out of the filter state — it maps
 *   to `user_id` on the transaction filter, but the group id is the caller's.
 */
export function useAuthorizedByFilter(field = "author"): FilterGroup {
  const { data, isLoading } = useAdminAccounts({
    limit: ADMIN_LIMIT,
    paginate: false,
  });

  return {
    id: field,
    label: "Authorized by",
    loading: isLoading,
    options: [
      { value: "", label: "Anyone" },
      ...(data?.data ?? []).map((admin) => ({
        value: admin.id,
        label: formatName(admin),
        adornment: (
          <Avatar
            name={formatName(admin)}
            src={admin.avatar ?? undefined}
            size="xs"
          />
        ),
      })),
    ],
  };
}
