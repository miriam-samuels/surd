import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const lockup = {
  blue: "/brand/surd-wordmark-blue.svg",
  white: "/brand/surd-wordmark-white.svg",
} as const;

type LogoProps = {
  tone?: keyof typeof lockup;
  className?: string;
};

export function Logo({ tone = "blue", className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="SURD home"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src={lockup[tone]}
        alt="SURD"
        width={86}
        height={32}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-16 shrink-0 place-items-center overflow-hidden rounded-[18px] bg-primary",
        className,
      )}
    >
      <Image
        src="/brand/surd-mark-white.svg"
        alt=""
        width={65}
        height={65}
        className="size-[65px] max-w-none"
      />
    </span>
  );
}

const LOCKUP_WIDTH = 161.164;
const WORDMARK_WIDTH = 102.478;
const MARK_WIDTH = LOCKUP_WIDTH - WORDMARK_WIDTH;

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block h-[60px] w-[102px] shrink-0 overflow-hidden",
        className,
      )}
    >
      <Image
        src="/brand/surd-wordmark-white.svg"
        alt=""
        width={LOCKUP_WIDTH}
        height={60}
        style={{ left: `-${MARK_WIDTH}px`, width: `${LOCKUP_WIDTH}px` }}
        className="absolute top-0 h-full max-w-none"
      />
    </span>
  );
}
