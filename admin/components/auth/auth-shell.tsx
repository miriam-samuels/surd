import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SHIMMER_DARK } from "@/lib/image-placeholder";
import ribbon from "@/public/patterns/shades.jpg";

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
            "grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-lg",
            "lg:grid-cols-2",
          )}
        >
          <BrandPanel />
          <div className="flex min-h-140 items-center px-6 py-10 sm:px-10 lg:min-h-160 lg:px-18 lg:py-16">
            <div className="w-full">{children}</div>
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
      className="relative hidden min-h-160 overflow-hidden bg-surd-blue-900 lg:block"
    >

      <Image
        src={ribbon}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="(min-width: 1024px) 50vw, 0px"
        className="object-cover"
      />

      <p className="relative px-12 pt-14 text-heading-lg font-bold text-white">
        Surd
        <br />
        Administrator
      </p>

      <Image
        src="/patterns/Black-Titanium.svg"
        alt=""
        width={580}
        height={385}
        unoptimized

        className="absolute inset-x-0 bottom-0 h-auto w-full"
      />
    </div>
  );
}
