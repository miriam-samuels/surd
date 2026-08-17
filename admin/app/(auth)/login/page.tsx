"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon } from "@hugeicons/core-free-icons";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * Step one of sign-in: collect the email, then hand off to `/verify-email`.
 *
 * The submit button stays disabled until the address looks valid, which is
 * what gives the design's grey → blue transition.
 *
 * NOTE: there is no auth backend yet. `submit` fakes the request; replace its
 * body with the real call and keep the surrounding states.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Stand-in for the suspended-account response until the API exists. */
const SUSPENDED_ACCOUNT = "suspended@surd.ng";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "suspended">(
    "idle",
  );

  const isValid = EMAIL_PATTERN.test(email);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (email.trim().toLowerCase() === SUSPENDED_ACCOUNT) {
      setStatus("suspended");
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-heading-xs font-bold text-grey-900">Welcome back</h1>
        <p className="text-md text-grey-500">Log in to your admin account.</p>
      </div>

      <Field label="Email address" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          leadingIcon={UserIcon}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "suspended") setStatus("idle");
          }}
          state={status === "suspended" ? "error" : "default"}
          size="lg"
        />
      </Field>

      {status === "suspended" ? (
        <Alert tone="warning" title="Account suspended.">
          Please contact your admin for further assistance.
        </Alert>
      ) : null}

      <Button
        type="submit"
        tone="primary"
        size="xl"
        shape="pill"
        block
        disabled={!isValid || status === "submitting"}
      >
        {status === "submitting" ? "Signing in…" : "Login"}
      </Button>
    </form>
  );
}
