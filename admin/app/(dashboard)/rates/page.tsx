"use client";

import { useState } from "react";
import { Calendar03Icon, Edit02Icon, PercentIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { Field } from "@/components/ui/field";
import { Flag } from "@/components/ui/flag";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { CurrencyChip, EditorCell } from "@/components/dashboard/editor-cell";
import { DataTable, type Column } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  CURRENCY_COUNTRY,
  EXCHANGE_RATES,
  type Currency,
  type ExchangeRate,
} from "@/content/configuration";

const CURRENCY_OPTIONS = (["NGN", "USD"] as Currency[]).map((currency) => ({
  value: currency,
  label: currency,
  icon: <Flag code={CURRENCY_COUNTRY[currency]} size="sm" />,
}));

export default function RatesPage() {
  const toast = useToast();
  const editRate = useDisclosure<ExchangeRate>();

  const columns: Column<ExchangeRate>[] = [
    {
      id: "pair",
      header: "Currency Pair",
      cell: (rate) => (
        <span className="flex items-center gap-3">
          <CurrencyChip currency={rate.from} className="bg-transparent px-0" />
          <span aria-hidden className="text-grey-300">
            &rarr;
          </span>
          <CurrencyChip currency={rate.to} className="bg-transparent px-0" />
        </span>
      ),
      width: "min-w-52",
    },
    { id: "value", header: "Value", cell: (rate) => rate.value },
    {
      id: "margin",
      header: "FX Margin",
      cell: (rate) => (
        <span className="flex flex-col">
          <span className="font-semibold">{rate.fxMargin}</span>
          <span className="text-xs text-grey-400">spread</span>
        </span>
      ),
    },
    {
      id: "effective",
      header: "Effective date",
      cell: (rate) => rate.effectiveDate,
    },
    {
      id: "updatedBy",
      header: "Last Updated by",
      cell: (rate) => <EditorCell editor={rate.updatedBy} />,
      width: "min-w-56",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (rate) => (
        <Button
          variant="soft"
          size="md"
          shape="pill"
          leadingIcon={Edit02Icon}
          onClick={() => editRate.open(rate)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Rates"
        description="Configure financial rates for all products"
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <DataTable
          data={EXCHANGE_RATES}
          columns={columns}
          getRowId={(rate) => rate.id}
          pagination={false}
          minWidth="min-w-4xl"
        />
      </section>

      <EditRateDialog
        control={editRate}
        onSave={() =>
          toast.show({ tone: "success", message: "Exchange rate updated." })
        }
      />
    </div>
  );
}

function EditRateDialog({
  control,
  onSave,
}: {
  control: ReturnType<typeof useDisclosure<ExchangeRate>>;
  onSave: () => void;
}) {
  const rate = control.data;
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("NGN");

  return (
    <Dialog
      control={control}
      title="Edit Rate"
      icon={PercentIcon}
      width="md"
      confirmLabel="Save changes"
      onConfirm={() => {
        control.close();
        onSave();
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="From" htmlFor="rate-from">
          <Dropdown
            options={CURRENCY_OPTIONS}
            value={rate?.from ?? from}
            onChange={setFrom}
            className="h-12 w-full rounded-xl border-transparent bg-grey-25"
          />
        </Field>
        <Field label="To" htmlFor="rate-to">
          <Dropdown
            options={CURRENCY_OPTIONS}
            value={rate?.to ?? to}
            onChange={setTo}
            className="h-12 w-full rounded-xl border-transparent bg-grey-25"
          />
        </Field>
      </div>

      <Field label="Rate">
        <div className="flex items-center gap-3">
          <Input
            size="lg"
            defaultValue="1"
            trailing={
              <span className="text-sm text-grey-400">{rate?.from ?? from}</span>
            }
          />
          <span aria-hidden className="text-grey-300">
            =
          </span>
          <Input
            size="lg"
            defaultValue="1,4008.81"
            trailing={
              <span className="text-sm text-grey-400">{rate?.to ?? to}</span>
            }
          />
        </div>
      </Field>

      <Field label="Effective date" htmlFor="rate-date">
        <Input
          id="rate-date"
          size="lg"
          defaultValue="12/12/2026"
          trailingIcon={Calendar03Icon}
        />
      </Field>
    </Dialog>
  );
}
