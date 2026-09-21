import { Badge, type BadgeTone } from "@/components/ui/badge";

const statusTones: Record<string, { tone: BadgeTone; label: string }> = {
  active: { tone: "success", label: "Active" },
  suspended: { tone: "warning", label: "Suspended" },
  closed: { tone: "danger", label: "Closed" },
  pending: { tone: "warning", label: "Pending" },
  "pending invite": { tone: "neutral", label: "Pending invite" },

  matured: { tone: "primary", label: "Matured" },
  broken: { tone: "danger", label: "Broken" },

  processing: { tone: "warning", label: "Processing" },
  completed: { tone: "success", label: "Completed" },
  failed: { tone: "danger", label: "Failed" },

  verified: { tone: "success", label: "Verified" },
  rejected: { tone: "danger", label: "Rejected" },

  locked: { tone: "primary", label: "Locked" },

  accrued: { tone: "warning", label: "Accrued" },
  paid: { tone: "success", label: "Paid" },
  "clawed back": { tone: "danger", label: "Clawed back" },

  USER_ACTIVE: { tone: "success", label: "Active" },

  
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

export function HniBadge() {
  return (
    <Badge tone="neutral" variant="outline" size="sm" className="border-purple-300 text-purple-600">
      HNI
    </Badge>
  );
}
