"use client";

import { useState } from "react";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { EditorCell } from "@/components/dashboard/editor-cell";
import { DataTable, type Column } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PLATFORM_CONFIGS, type PlatformConfig } from "@/content/configuration";

const UNIT_OPTIONS = [
  { value: "percentage", label: "% Percentage" },
  { value: "currency", label: "₦ Currency" },
  { value: "duration", label: "Duration" },
];

/** Platform-wide keys that every product inherits unless it overrides them. */
export default function PlatformConfigurationPage() {
  const toast = useToast();
  const edit = useDisclosure<PlatformConfig>();

  const columns: Column<PlatformConfig>[] = [
    {
      id: "type",
      header: "Type",
      cell: (row) => <span className="font-medium">{row.type}</span>,
      width: "min-w-48",
    },
    {
      id: "value",
      header: "Value",
      cell: (row) => <span className="font-bold">{row.value}</span>,
    },
    {
      id: "description",
      header: "Description",
      cell: (row) => (
        <span className="block max-w-md text-grey-600">{row.description}</span>
      ),
      width: "min-w-80",
    },
    {
      id: "updatedBy",
      header: "Updated by",
      cell: (row) => <EditorCell editor={row.updatedBy} />,
      width: "min-w-52",
    },
    {
      id: "lastUpdated",
      header: "Last updated",
      cell: (row) => row.lastUpdated,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <Button
          variant="soft"
          size="md"
          shape="pill"
          leadingIcon={Edit02Icon}
          onClick={() => edit.open(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Platform Configuration"
        description="Manage all relevant variable system keys"
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <DataTable
          data={PLATFORM_CONFIGS}
          columns={columns}
          getRowId={(row) => row.id}
          pagination={false}
          minWidth="min-w-6xl"
        />
      </section>

      <EditConfigKeyDialog
        control={edit}
        onSave={() =>
          toast.show({ tone: "success", message: "Configuration key updated." })
        }
      />
    </div>
  );
}

function EditConfigKeyDialog({
  control,
  onSave,
}: {
  control: ReturnType<typeof useDisclosure<PlatformConfig>>;
  onSave: () => void;
}) {
  const config = control.data;
  const [unit, setUnit] = useState("percentage");

  return (
    <Dialog
      control={control}
      title="Edit Config Key"
      icon={Edit02Icon}
      confirmLabel="Save changes"
      onConfirm={() => {
        control.close();
        onSave();
      }}
    >
      {/* The key itself is fixed — only its value and description change. */}
      <Field label="Type" htmlFor="config-key-type">
        <Input
          id="config-key-type"
          size="lg"
          defaultValue={config?.type}
          readOnly
        />
      </Field>

      <Field label="Value">
        <div className="flex items-center gap-3">
          <Input size="lg" defaultValue={config?.value} className="flex-1" />
          <Dropdown
            options={UNIT_OPTIONS}
            value={config?.unit ?? unit}
            onChange={setUnit}
            className="h-12 w-44 shrink-0 rounded-xl border-transparent bg-grey-25"
          />
        </div>
      </Field>

      <Field label="Description" htmlFor="config-key-description">
        <textarea
          id="config-key-description"
          rows={5}
          defaultValue={config?.description}
          className="w-full resize-y rounded-xl bg-grey-25 px-4 py-3 text-sm text-grey-900 outline-none placeholder:text-grey-300 focus:shadow-ring-gray"
        />
      </Field>
    </Dialog>
  );
}
