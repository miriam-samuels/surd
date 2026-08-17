import {
  ArrowDataTransferHorizontalIcon,
  BankIcon,
  CodeIcon,
  DashboardSquare02Icon,
  DocumentValidationIcon,
  MoneyBag02Icon,
  News01Icon,
  PercentIcon,
  PiggyBankIcon,
  SecurityLockIcon,
  Settings02Icon,
  Task01Icon,
  UserGroupIcon,
  UserSettings01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@/components/ui/icon";
import { ROUTES } from "@/constants/routes";

/**
 * The admin sidebar, as data.
 *
 * Paths come from `@/constants/routes` so renaming a route updates the nav
 * automatically. The first group has no title, matching the design where
 * "Dashboard" sits alone above the labelled sections.
 */

export type NavItem = {
  label: string;
  href: string;
  icon: IconSvgElement;
  /** Optional count rendered as a pill on the right. */
  badge?: number;
};

export type NavGroup = {
  id: string;
  title?: string;
  items: NavItem[];
};

export const SIDEBAR_GROUPS: NavGroup[] = [
  {
    id: "overview",
    items: [
      {
        label: "Dashboard",
        href: ROUTES.dashboard,
        icon: DashboardSquare02Icon,
      },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    items: [
      {
        label: "Flexi Wallet",
        href: ROUTES.finance.flexiWallet,
        icon: Wallet01Icon,
      },
      { label: "Savings", href: ROUTES.finance.savings, icon: PiggyBankIcon },
      { label: "ROI", href: ROUTES.finance.roi, icon: MoneyBag02Icon },
      { label: "Vault", href: ROUTES.finance.vault, icon: SecurityLockIcon },
      { label: "Treasury", href: ROUTES.finance.treasury, icon: BankIcon },
      {
        label: "Transaction history",
        href: ROUTES.finance.transactions,
        icon: ArrowDataTransferHorizontalIcon,
      },
    ],
  },
  {
    id: "users",
    title: "Users",
    items: [
      { label: "User List", href: ROUTES.users.list, icon: UserGroupIcon },
      {
        label: "KYC & Compliance",
        href: ROUTES.users.kyc,
        icon: DocumentValidationIcon,
      },
    ],
  },
  {
    id: "configurations",
    title: "Configurations",
    items: [
      { label: "Rates", href: ROUTES.configurations.rates, icon: PercentIcon },
      {
        label: "Product Configuration",
        href: ROUTES.configurations.products,
        icon: Settings02Icon,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    items: [
      {
        label: "Admin accounts",
        href: ROUTES.settings.admins,
        icon: UserSettings01Icon,
      },
      {
        label: "Content & Marketing",
        href: ROUTES.settings.content,
        icon: News01Icon,
      },
      {
        label: "Platform Configuration",
        href: ROUTES.settings.platform,
        icon: CodeIcon,
      },
      {
        label: "Audit Logs",
        href: ROUTES.settings.auditLogs,
        icon: Task01Icon,
      },
    ],
  },
];
