import { cn } from "@/lib/cn";

/**
 * Label, control and message, wired together.
 *
 * Wrap any control from this library. `error` takes precedence over `hint`,
 * and both are linked to the control with `aria-describedby` via the id you
 * pass down.
 *
 *   <Field label="Email" htmlFor="email" error={errors.email}>
 *     <Input id="email" state={errors.email ? "error" : "default"} />
 *   </Field>
 */

type FieldProps = React.ComponentProps<"div"> & {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className,
  children,
  ...props
}: FieldProps) {
  const message = error ?? hint;
  const messageId = htmlFor ? `${htmlFor}-message` : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-grey-500"
        >
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}

      {children}

      {message ? (
        <p
          id={messageId}
          className={cn(
            "text-xs",
            error ? "text-red-600" : "text-grey-400",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
