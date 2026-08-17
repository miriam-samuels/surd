"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";

/**
 * Step two: confirm the six-digit code.
 *
 * Wrapped in Suspense because `useSearchParams` opts the tree into client-side
 * rendering, and Next requires a boundary around that during prerender.
 */
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifySkeleton />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

const CODE_LENGTH = 6;
const RESEND_SECONDS = 119;

function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  /* Count down to the moment the code can be resent. */
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(
      () => setSecondsLeft((current) => current - 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const verify = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length < CODE_LENGTH) return;
    /* No auth backend yet — treat any code as incorrect to show the state. */
    setError(true);
  };

  const resend = () => {
    setCode("");
    setError(false);
    setSecondsLeft(RESEND_SECONDS);
  };

  return (
    <form onSubmit={verify} className="flex flex-col gap-6">
      <Button
        type="button"
        variant="outline"
        shape="pill"
        size="md"
        className="w-fit"
        leadingIcon={ArrowLeft02Icon}
        onClick={() => router.push("/login")}
      >
        Back
      </Button>

      <div className="flex flex-col gap-3">
        <h1 className="text-heading-xs font-bold text-grey-900">
          Verify your email address
        </h1>
        <p className="text-md text-grey-500">
          Please enter the {CODE_LENGTH}-digit code sent to{" "}
          {email ? (
            <span className="font-semibold text-grey-900">{email}</span>
          ) : (
            "your email"
          )}
          .
        </p>
      </div>

      <OtpInput
        value={code}
        onChange={(next) => {
          setCode(next);
          setError(false);
        }}
        length={CODE_LENGTH}
        state={error ? "error" : "default"}
      />

      {secondsLeft > 0 && !error ? (
        <p className="text-sm text-grey-300">
          Resend code in {formatCountdown(secondsLeft)}
        </p>
      ) : (
        <button
          type="button"
          onClick={resend}
          className="w-fit text-sm font-bold text-orange-500 outline-none hover:underline focus-visible:underline"
        >
          Resend code
        </button>
      )}

      <Button
        type="submit"
        tone="primary"
        size="xl"
        shape="pill"
        block
        disabled={code.length < CODE_LENGTH}
      >
        Verify code
      </Button>
    </form>
  );
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function VerifySkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-9 w-24 rounded-full bg-grey-50" />
      <div className="h-8 w-3/4 rounded bg-grey-50" />
      <div className="h-5 w-full rounded bg-grey-50" />
      <div className="flex gap-3">
        {Array.from({ length: CODE_LENGTH }).map((_, index) => (
          <div key={index} className="size-12 rounded-xl bg-grey-50 sm:size-14" />
        ))}
      </div>
      <div className="h-12 w-full rounded-full bg-grey-50" />
    </div>
  );
}
