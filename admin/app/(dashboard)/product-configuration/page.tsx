"use client";

import { useState } from "react";
import {
  Calendar03Icon,
  Edit02Icon,
  ImageUploadIcon,
  PlusSignIcon,
  SecurityLockIcon,
  Settings02Icon,
  Target02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { Field } from "@/components/ui/field";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { PageHeader } from "@/components/ui/page-header";
import {
  CurrencyChip,
  CurrencyChips,
  EditorCell,
} from "@/components/dashboard/editor-cell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { TabPanel, Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  FEE_TYPES,
  FIXED_DEPOSIT_FEES,
  FLEXI_RATES,
  PRODUCTS,
  SAVINGS_TEMPLATES,
  TARGET_FEES,
  TENURES,
  type FeeCharge,
  type FlexiRate,
  type ProductId,
  type SavingsTemplate,
  type Tenure,
} from "@/content/configuration";
import { cn } from "@/lib/cn";

const PRODUCT_ICONS: Record<ProductId, IconSvgElement> = {
  "target-savings": Target02Icon,
  "fixed-deposit": SecurityLockIcon,
  "flexi-wallet": Wallet01Icon,
};

/**
 * Configuration for the three savings products.
 *
 * A product selector picks the panel; each panel is its own component below so
 * the differences between them stay visible rather than buried in conditionals.
 */
export default function ProductConfigurationPage() {
  const [product, setProduct] = useState<ProductId>("target-savings");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Product Configuration"
        description="Transaction and platform limits"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {PRODUCTS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setProduct(entry.id)}
            aria-pressed={product === entry.id}
            className={cn(
              "flex items-start justify-between gap-4 rounded-2xl border bg-white p-5 text-left",
              "transition-colors outline-none focus-visible:shadow-ring-primary",
              product === entry.id
                ? "border-primary"
                : "border-grey-50 hover:border-grey-100",
            )}
          >
            <span className="flex flex-col gap-1">
              <span
                className={cn(
                  "text-lg font-bold",
                  product === entry.id ? "text-primary" : "text-grey-900",
                )}
              >
                {entry.title}
              </span>
              <span className="text-sm text-grey-400">{entry.description}</span>
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surd-blue-50 text-primary">
              <Icon icon={PRODUCT_ICONS[entry.id]} size={20} />
            </span>
          </button>
        ))}
      </div>

      {product === "target-savings" ? <TargetSavingsPanel /> : null}
      {product === "fixed-deposit" ? <FixedDepositPanel /> : null}
      {product === "flexi-wallet" ? <FlexiWalletPanel /> : null}
    </div>
  );
}

/** Shell shared by the three panels: pill tabs on the left, action on the right. */
function ConfigPanel({
  tabs,
  value,
  onValueChange,
  action,
  children,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
      <Tabs
        items={tabs}
        value={value}
        onValueChange={onValueChange}
        variant="pill"
        className="gap-6"
        listClassName="justify-between"
      >
        {action}
        {children}
      </Tabs>
    </section>
  );
}

/* --------------------------------------------------------- target savings */

function TargetSavingsPanel() {
  const toast = useToast();
  const [view, setView] = useState("templates");
  const newTemplate = useDisclosure();
  const editFee = useDisclosure<FeeCharge>();

  const templateColumns: Column<SavingsTemplate>[] = [
    { id: "name", header: "Name", cell: (row) => row.name },
    { id: "mode", header: "Mode", cell: (row) => row.mode },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChips currencies={row.currencies} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    { id: "updated", header: "Last Updated", cell: (row) => row.lastUpdated },
    {
      id: "actions",
      header: "Actions",
      cell: () => <EditButton onClick={() => editFee.open()} />,
    },
  ];

  return (
    <>
      <ConfigPanel
        tabs={[
          { value: "templates", label: "Templates" },
          { value: "fees", label: "Fees & Charges" },
        ]}
        value={view}
        onValueChange={setView}
        action={
          <Button
            tone="primary"
            size="xl"
            shape="pill"
            leadingIcon={PlusSignIcon}
            className="ml-auto"
            onClick={() => newTemplate.open()}
          >
            New Template
          </Button>
        }
      >
        <TabPanel value="templates">
          <DataTable
            data={SAVINGS_TEMPLATES}
            columns={templateColumns}
            getRowId={(row) => row.id}
            minWidth="min-w-4xl"
          />
        </TabPanel>
        <TabPanel value="fees">
          <FeesTable rows={TARGET_FEES} onEdit={editFee.open} />
        </TabPanel>
      </ConfigPanel>

      <NewTemplateDialog
        control={newTemplate}
        onSave={() =>
          toast.show({ tone: "success", message: "Template created." })
        }
      />
      <EditConfigurationDialog
        control={editFee}
        onSave={() =>
          toast.show({ tone: "success", message: "Configuration updated." })
        }
      />
    </>
  );
}

/* ---------------------------------------------------------- fixed deposit */

function FixedDepositPanel() {
  const toast = useToast();
  const [view, setView] = useState("tenure");
  const newTenure = useDisclosure();
  const editFee = useDisclosure<FeeCharge>();

  const tenureColumns: Column<Tenure>[] = [
    { id: "type", header: "Type", cell: (row) => row.duration },
    {
      id: "rates",
      header: "Currency & Rate",
      cell: (row) => (
        <span className="flex flex-wrap items-center gap-2">
          {row.rates.map((entry) => (
            <CurrencyChip
              key={entry.currency}
              currency={entry.currency}
              suffix={`-${entry.rate}`}
            />
          ))}
        </span>
      ),
      width: "min-w-64",
    },
    {
      id: "effective",
      header: "Effective date",
      cell: (row) => row.effectiveDate,
    },
    {
      id: "updatedBy",
      header: "Last Updated by",
      cell: (row) => <EditorCell editor={row.updatedBy} />,
      width: "min-w-56",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => <EditButton onClick={() => editFee.open()} />,
    },
  ];

  return (
    <>
      <ConfigPanel
        tabs={[
          { value: "tenure", label: "Tenure" },
          { value: "fees", label: "Fees & Charges" },
        ]}
        value={view}
        onValueChange={setView}
        action={
          <Button
            tone="primary"
            size="xl"
            shape="pill"
            leadingIcon={PlusSignIcon}
            className="ml-auto"
            onClick={() => newTenure.open()}
          >
            New Tenure
          </Button>
        }
      >
        <TabPanel value="tenure">
          <DataTable
            data={TENURES}
            columns={tenureColumns}
            getRowId={(row) => row.id}
            pagination={false}
            minWidth="min-w-4xl"
          />
        </TabPanel>
        <TabPanel value="fees">
          <FeesTable
            rows={FIXED_DEPOSIT_FEES}
            onEdit={editFee.open}
            appliesToLabel="Applies to"
          />
        </TabPanel>
      </ConfigPanel>

      <NewTenureDialog
        control={newTenure}
        onSave={() => toast.show({ tone: "success", message: "Tenure created." })}
      />
      <EditConfigurationDialog
        control={editFee}
        onSave={() =>
          toast.show({ tone: "success", message: "Configuration updated." })
        }
      />
    </>
  );
}

/* ----------------------------------------------------------- flexi wallet */

function FlexiWalletPanel() {
  const toast = useToast();
  const editFee = useDisclosure<FeeCharge>();

  const columns: Column<FlexiRate>[] = [
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency} />,
    },
    { id: "type", header: "Type", cell: (row) => row.type },
    { id: "rate", header: "Rate", cell: (row) => row.rate },
    {
      id: "effective",
      header: "Effective date",
      cell: (row) => row.effectiveDate,
    },
    {
      id: "updatedBy",
      header: "Last Updated by",
      cell: (row) => <EditorCell editor={row.updatedBy} />,
      width: "min-w-56",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => <EditButton onClick={() => editFee.open()} />,
    },
  ];

  return (
    <>
      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <DataTable
          data={FLEXI_RATES}
          columns={columns}
          getRowId={(row) => row.id}
          pagination={false}
          minWidth="min-w-4xl"
        />
      </section>

      <EditConfigurationDialog
        control={editFee}
        onSave={() =>
          toast.show({ tone: "success", message: "Configuration updated." })
        }
      />
    </>
  );
}

/* ------------------------------------------------------------------ pieces */

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="soft"
      size="md"
      shape="pill"
      leadingIcon={Edit02Icon}
      onClick={onClick}
    >
      Edit
    </Button>
  );
}

function FeesTable({
  rows,
  onEdit,
  appliesToLabel = "Applies to",
}: {
  rows: FeeCharge[];
  onEdit: (fee: FeeCharge) => void;
  appliesToLabel?: string;
}) {
  const columns: Column<FeeCharge>[] = [
    { id: "name", header: "Name", cell: (row) => row.name },
    { id: "appliesTo", header: appliesToLabel, cell: (row) => row.appliesTo },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChips currencies={row.currencies} />,
    },
    { id: "value", header: "Value", cell: (row) => row.value },
    {
      id: "effective",
      header: "Effective date",
      cell: (row) => row.effectiveDate,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => <EditButton onClick={() => onEdit(row)} />,
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      minWidth="min-w-4xl"
    />
  );
}

/** Two-up currency toggles, as used by several configuration dialogs. */
function CurrencyToggles({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (currency: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {(["NGN", "USD"] as const).map((currency) => (
        <label
          key={currency}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold",
            selected.includes(currency)
              ? "border-primary bg-surd-blue-50 text-grey-900"
              : "border-grey-100 bg-white text-grey-500",
          )}
        >
          <Checkbox
            checked={selected.includes(currency)}
            onCheckedChange={() => onToggle(currency)}
          />
          <CurrencyChip currency={currency} className="bg-transparent px-0" />
        </label>
      ))}
    </div>
  );
}

function useCurrencySelection(initial: string[] = ["NGN", "USD"]) {
  const [selected, setSelected] = useState(initial);
  const toggle = (currency: string) =>
    setSelected((current) =>
      current.includes(currency)
        ? current.filter((item) => item !== currency)
        : [...current, currency],
    );
  return { selected, toggle };
}

function EditConfigurationDialog({
  control,
  onSave,
}: {
  control: ReturnType<typeof useDisclosure<FeeCharge>>;
  onSave: () => void;
}) {
  const currencies = useCurrencySelection();
  const [type, setType] = useState<string>(FEE_TYPES[0]);

  return (
    <Dialog
      control={control}
      title="Edit Configuration"
      icon={Settings02Icon}
      confirmLabel="Save changes"
      onConfirm={() => {
        control.close();
        onSave();
      }}
    >
      <Field label="Type" htmlFor="config-type">
        <Dropdown
          options={FEE_TYPES.map((option) => ({ value: option, label: option }))}
          value={control.data?.name ?? type}
          onChange={setType}
          className="h-12 w-full rounded-xl border-transparent bg-grey-25"
        />
      </Field>

      <Field label="Value(%)" htmlFor="config-value">
        <NumberInput id="config-value" size="lg" defaultValue={1} />
      </Field>

      <Field label="Applicable Currency">
        <CurrencyToggles
          selected={currencies.selected}
          onToggle={currencies.toggle}
        />
      </Field>

      <Field label="Effective date" htmlFor="config-date">
        <Input
          id="config-date"
          size="lg"
          defaultValue="12/12/2026"
          trailingIcon={Calendar03Icon}
        />
      </Field>
    </Dialog>
  );
}

function NewTemplateDialog({
  control,
  onSave,
}: {
  control: ReturnType<typeof useDisclosure<void>>;
  onSave: () => void;
}) {
  const currencies = useCurrencySelection();
  const modes = useCurrencySelection(["Locked", "Flexible"]);

  return (
    <Dialog
      control={control}
      title="New Template"
      icon={PlusSignIcon}
      confirmLabel="Create template"
      onConfirm={() => {
        control.close();
        onSave();
      }}
    >
      <Field label="Template name" htmlFor="template-name">
        <Input id="template-name" size="lg" placeholder="30 days" />
      </Field>

      <Field label="Template image">
        <div className="flex flex-col items-center gap-2 rounded-xl bg-grey-25 px-6 py-10 text-center">
          <Icon icon={ImageUploadIcon} size={24} className="text-grey-300" />
          <p className="text-sm text-grey-400">Upload image. max size 2mb</p>
          <p className="text-sm text-grey-400">1080 x 1080px</p>
        </div>
      </Field>

      <Field label="Applicable Currency">
        <CurrencyToggles
          selected={currencies.selected}
          onToggle={currencies.toggle}
        />
      </Field>

      <Field label="Mode">
        <div className="grid grid-cols-2 gap-4">
          {["Locked", "Flexible"].map((mode) => (
            <label
              key={mode}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold",
                modes.selected.includes(mode)
                  ? "border-primary bg-surd-blue-50 text-grey-900"
                  : "border-grey-100 bg-white text-grey-500",
              )}
            >
              <Checkbox
                checked={modes.selected.includes(mode)}
                onCheckedChange={() => modes.toggle(mode)}
              />
              {mode}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Duration" htmlFor="template-duration">
        <NumberInput id="template-duration" size="lg" defaultValue={30} />
      </Field>
    </Dialog>
  );
}

function NewTenureDialog({
  control,
  onSave,
}: {
  control: ReturnType<typeof useDisclosure<void>>;
  onSave: () => void;
}) {
  const currencies = useCurrencySelection();

  return (
    <Dialog
      control={control}
      title="New Tenure"
      icon={Calendar03Icon}
      confirmLabel="Create Tenure"
      onConfirm={() => {
        control.close();
        onSave();
      }}
    >
      <Field label="Duration" htmlFor="tenure-duration">
        <Input id="tenure-duration" size="lg" placeholder="30 days" />
      </Field>

      <Field label="Applicable Currency">
        <CurrencyToggles
          selected={currencies.selected}
          onToggle={currencies.toggle}
        />
      </Field>

      <Field label="Rate(%)" htmlFor="tenure-rate">
        <NumberInput id="tenure-rate" size="lg" defaultValue={2} />
      </Field>

      <Field label="Effective date" htmlFor="tenure-date">
        <Input
          id="tenure-date"
          size="lg"
          defaultValue="12/12/2026"
          trailingIcon={Calendar03Icon}
        />
      </Field>
    </Dialog>
  );
}
