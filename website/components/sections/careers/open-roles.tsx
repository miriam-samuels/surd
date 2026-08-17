"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight02Icon,
  BriefcaseDollarIcon,
  FlashIcon,
  Link05Icon,
  Location05Icon,
} from "@hugeicons/core-free-icons";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Select } from "@/components/ui/select";
import {
  DEPARTMENTS,
  OFFICES,
  OPPORTUNITIES,
  type Job,
} from "@/content/careers";
import { cn } from "@/lib/cn";

export function OpenRoles({ roles }: { roles: Job[] }) {
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [office, setOffice] = useState(OFFICES[0]);

  const filtered = useMemo(
    () =>
      roles.filter(
        (role) =>
          (department === DEPARTMENTS[0] || role.department === department) &&
          (office === OFFICES[0] || role.office === office),
      ),
    [roles, department, office],
  );

  return (
    <div className="rounded-3xl border border-grey-50 p-6 sm:p-10 lg:p-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <Eyebrow icon={FlashIcon}>{OPPORTUNITIES.eyebrow}</Eyebrow>
          <h2 className="max-w-lg text-heading-sm font-extrabold text-balance sm:text-heading-lg">
            {OPPORTUNITIES.title}
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            label="Department"
            value={department}
            options={DEPARTMENTS}
            onValueChange={setDepartment}
          />
          <Select
            label="Office"
            value={office}
            options={OFFICES}
            onValueChange={setOffice}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <p className="mt-10 text-md font-bold text-primary">
            {filtered.length} open {filtered.length === 1 ? "role" : "roles"}
          </p>
          <ul className="mt-4 flex flex-col">
            {filtered.map((role) => (
              <RoleRow key={role.slug} role={role} />
            ))}
          </ul>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function RoleRow({ role }: { role: Job }) {
  return (
    <li className="flex flex-col gap-4 border-t border-dashed border-grey-100 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-sm font-extrabold tracking-[0.1em] text-grey-300 uppercase">
          {role.department}
        </span>
        <h3 className="text-2xl font-semibold text-grey-900">
          <Link
            href={`/careers/${role.slug}`}
            className="outline-none hover:underline focus-visible:underline"
          >
            {role.title}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-lg font-medium text-grey-400">
          <span className="inline-flex items-center gap-1.5">
            <Icon icon={Location05Icon} size={16} className="text-primary" />
            {role.office}
          </span>
          <span aria-hidden className="text-grey-200">
            —
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon
              icon={BriefcaseDollarIcon}
              size={16}
              className="text-primary"
            />
            {role.type}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <CopyLinkButton slug={role.slug} title={role.title} />
        <Button asChild>
          <Link href={`/careers/${role.slug}`}>
            Apply now
            <Icon icon={ArrowRight02Icon} size={20} strokeWidth={2}/>
          </Link>
        </Button>
      </div>
    </li>
  );
}

function CopyLinkButton({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/careers/${slug}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy link to ${title}`}
      title={copied ? "Link copied" : "Copy link"}
      className={cn(
        "grid w-14 h-10 place-items-center rounded-full border border-grey-100",
        "text-grey-900 transition-colors outline-none",
        "hover:border-grey-150 hover:text-grey-900",
        "focus-visible:shadow-ring-primary",
        copied && "border-primary text-primary",
      )}
    >
      <Icon icon={Link05Icon} size={18} strokeWidth={2} />
    </button>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-grey-25 px-6 py-20 text-center">
      <MediaPlaceholder
        label="Coin illustration"
        aspect="aspect-square"
        className="size-20 rounded-full bg-yellow-100 text-yellow-600"
      />
      <h3 className="text-xl font-bold text-grey-900">
        {OPPORTUNITIES.emptyTitle}
      </h3>
      <p className="max-w-md text-paragraph-sm text-grey-400">
        {OPPORTUNITIES.emptyBody} Shoot us an email at{" "}
        <a
          href={`mailto:${OPPORTUNITIES.emptyEmail}`}
          className="font-semibold text-grey-900 underline"
        >
          {OPPORTUNITIES.emptyEmail}
        </a>
      </p>
    </div>
  );
}
