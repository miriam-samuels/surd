import { Badge, type BadgeTone } from "@/components/ui/badge";

/**
 * Domain status → badge tone, in one table.
 *
 * Keeping the mapping here means "Active" is the same green on every page, and
 * adding a status is one entry rather than a search across the codebase.
 */

const statusTones: Record<string, { tone: BadgeTone; label: string }> = {
  /* Accounts */
  active: { tone: "success", label: "Active" },
  suspended: { tone: "warning", label: "Suspended" },
  closed: { tone: "danger", label: "Closed" },
  pending: { tone: "warning", label: "Pending" },
  "pending invite": { tone: "neutral", label: "Pending invite" },

  /* Plans */
  matured: { tone: "primary", label: "Matured" },
  broken: { tone: "danger", label: "Broken" },

  /* Transactions */
  processing: { tone: "warning", label: "Processing" },
  completed: { tone: "success", label: "Completed" },
  failed: { tone: "danger", label: "Failed" },

  /* KYC */
  verified: { tone: "success", label: "Verified" },
  rejected: { tone: "danger", label: "Rejected" },

  /* Vault positions */
  locked: { tone: "primary", label: "Locked" },

  /* ROI */
  accrued: { tone: "warning", label: "Accrued" },
  paid: { tone: "success", label: "Paid" },
  "clawed back": { tone: "danger", label: "Clawed back" },
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md" | "lg";
}) {
  const key = status.toLowerCase();
  const config = statusTones[key] ?? { tone: "neutral" as const, label: status };

  return (
    <Badge tone={config.tone} variant="outline" size={size}>
      {config.label}
    </Badge>
  );
}

/** The purple "HNI" marker beside a high-net-worth account's name. */
export function HniBadge() {
  return (
    <Badge tone="neutral" variant="outline" size="sm" className="border-purple-300 text-purple-600">
      HNI
    </Badge>
  );
}
