import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SHIMMER_DARK } from "@/lib/image-placeholder";
import ribbon from "@/public/patterns/shades.jpg";

/**
 * The split card every auth screen sits in.
 *
 * Left is the brand panel — the exported ribbon backdrop with the app render
 * standing on it. It is decorative and drops out below `lg`, where the form
 * takes the full width.
 *
 * Right is the slot each screen fills with its own form.
 */

const AUTH_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Help", href: "/help" },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-grey-25">
      <AuthTopbar />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:py-16">
        <div
          className={cn(
            "grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg",
            "lg:grid-cols-2",
          )}
        >
          <BrandPanel />
          <div className="flex items-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AuthTopbar() {
  return (
    <header className="flex items-center justify-between border-b border-grey-50 bg-white px-5 py-5 sm:px-8">
      <Link href="/" className="flex items-center gap-2.5" aria-label="SURD Admin">
        <Image
          src="/brand/surd-wordmark-blue.svg"
          alt="SURD"
          width={86}
          height={32}
          priority
          className="h-7 w-auto"
        />
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          Admin
        </span>
      </Link>

      <nav aria-label="Support">
        <ul className="flex items-center gap-5 sm:gap-7">
          {AUTH_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-semibold text-grey-900 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function BrandPanel() {
  return (
    <div
      aria-hidden
      className="relative hidden min-h-125 overflow-hidden bg-surd-blue-900 lg:block"
    >
      {/* Imported rather than referenced by path so the build derives the
          blur-up thumbnail the ribbon fades in from. */}
      <Image
        src={ribbon}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="(min-width: 1024px) 50vw, 0px"
        className="object-cover"
      />

      <p className="relative px-12 pt-14 text-heading-md font-extrabold text-white">
        Surd
        <br />
        Administrator
      </p>

      {/* The render already bleeds off its own left edge, so it sits flush to
          the bottom at full width and the panel crops the rest. */}
      <Image
        src="/patterns/Black-Titanium.svg"
        alt=""
        width={580}
        height={385}
        unoptimized
        placeholder={SHIMMER_DARK}
        className="absolute inset-x-0 bottom-0 h-auto w-full"
      />
    </div>
  );
}
