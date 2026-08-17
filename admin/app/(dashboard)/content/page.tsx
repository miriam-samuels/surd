"use client";

import { useState } from "react";
import {
  CodeIcon,
  Edit02Icon,
  Globe02Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { EditorCell } from "@/components/dashboard/editor-cell";
import { DataTable, type Column } from "@/components/ui/table";
import { TabPanel, Tabs, type TabItem } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  CONTENT_ENTRIES,
  CONTENT_PLACEMENTS,
  type ContentEntry,
} from "@/content/configuration";

const PLATFORM_TABS: TabItem[] = [
  { value: "mobile", label: "Mobile app", icon: SmartPhone01Icon },
  { value: "admin", label: "Admin", icon: CodeIcon },
  { value: "website", label: "Website", icon: Globe02Icon },
];

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "french", label: "French" },
];

const PLACEMENT_OPTIONS = CONTENT_PLACEMENTS.map((placement) => ({
  value: placement,
  label: placement,
}));

/**
 * Copy managed across the three Surd surfaces.
 *
 * All three platforms share one table shape, so the tabs swap the dataset
 * rather than the layout.
 */
export default function ContentPage() {
  const toast = useToast();
  const [platform, setPlatform] = useState("mobile");
  const edit = useDisclosure<ContentEntry>();

  const columns: Column<ContentEntry>[] = [
    { id: "key", header: "Key", cell: (row) => row.key },
    {
      id: "title",
      header: "Title",
      cell: (row) => <span className="font-semibold">{row.title}</span>,
      width: "min-w-44",
    },
    { id: "placement", header: "Placement", cell: (row) => row.placement },
    {
      id: "english",
      header: "English",
      cell: (row) => <Truncated text={row.english} />,
      width: "min-w-40",
    },
    {
      id: "french",
      header: "French",
      cell: (row) => <Truncated text={row.french} />,
      width: "min-w-40",
    },
    {
      id: "updatedBy",
      header: "Updated by",
      cell: (row) => <EditorCell editor={row.updatedBy} />,
      width: "min-w-48",
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
        title="Content & Marketing"
        description="Manage all content across all Surd platforms"
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <Tabs
          items={PLATFORM_TABS}
          value={platform}
          onValueChange={setPlatform}
          variant="pill"
          className="gap-6"
        >
          {PLATFORM_TABS.map((tab) => (
            <TabPanel key={tab.value} value={tab.value}>
              <DataTable
                data={CONTENT_ENTRIES}
                columns={columns}
                getRowId={(row) => row.id}
                minWidth="min-w-6xl"
              />
            </TabPanel>
          ))}
        </Tabs>
      </section>

      <EditContentDialog
        control={edit}
        onSave={() => toast.show({ tone: "success", message: "Content updated." })}
      />
    </div>
  );
}

function Truncated({ text }: { text: string }) {
  return (
    <span className="block max-w-40 truncate" title={text}>
      {text}
    </span>
  );
}

function EditContentDialog({
  control,
  onSave,
}: {
  control: ReturnType<typeof useDisclosure<ContentEntry>>;
  onSave: () => void;
}) {
  const entry = control.data;
  const [placement, setPlacement] = useState<string>(CONTENT_PLACEMENTS[0]);
  const [language, setLanguage] = useState("english");

  return (
    <Dialog
      control={control}
      title="Edit content"
      icon={Edit02Icon}
      confirmLabel="Save changes"
      onConfirm={() => {
        control.close();
        onSave();
      }}
    >
      <Field label="Title" htmlFor="content-title">
        <Input
          id="content-title"
          size="lg"
          defaultValue={entry?.title}
          placeholder="e.g. Home banner"
        />
      </Field>

      <Field label="Placement" htmlFor="content-placement">
        <Dropdown
          options={PLACEMENT_OPTIONS}
          value={entry?.placement ?? placement}
          onChange={setPlacement}
          className="h-12 w-full rounded-xl border-transparent bg-grey-25"
        />
      </Field>

      <Field label="Language" htmlFor="content-language">
        <Dropdown
          options={LANGUAGES}
          value={language}
          onChange={setLanguage}
          className="h-12 w-full rounded-xl border-transparent bg-grey-25"
        />
      </Field>

      <Field label="Text" htmlFor="content-text">
        <textarea
          id="content-text"
          rows={5}
          defaultValue={entry?.english}
          placeholder="Copy shown to the user"
          className="w-full resize-y rounded-xl bg-grey-25 px-4 py-3 text-sm text-grey-900 outline-none placeholder:text-grey-300 focus:shadow-ring-gray"
        />
      </Field>
    </Dialog>
  );
}
