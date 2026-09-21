/*
 * The Content-Security-Policy, built per request by `proxy.ts`. It cannot be a
 * static header: the App Router streams its RSC payload in inline <script>
 * tags, and a `script-src 'self'` with no nonce blocks them — the page renders
 * its loading state and never hydrates.
 */
export function contentSecurityPolicy(nonce: string) {
  const isDev = process.env.NODE_ENV === "development";
  const origin = graphOrigin(isDev);

  return [
    "default-src 'self'",
    /* 'strict-dynamic' lets the nonced bootstrap load the chunks it needs
       without listing each one. Dev adds 'unsafe-eval' for React's
       server-error stack reconstruction. */
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    /* 'unsafe-inline' stays: Radix and Recharts position things with inline
       style attributes, which a nonce cannot cover. */
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self'${origin ? ` ${origin}` : ""}${isDev ? " ws: http://localhost:*" : ""}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function graphOrigin(isDev: boolean): string | null {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  if (!endpoint) {
    const message =
      "NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set. The CSP would block every " +
      "request to the graph. Set it before building - see .env.example.";
    if (!isDev) throw new Error(message);
    console.warn(`[csp] ${message}`);
    return null;
  }

  try {
    return new URL(endpoint).origin;
  } catch {
    const message = `NEXT_PUBLIC_GRAPHQL_ENDPOINT is not a valid URL: ${endpoint}`;
    if (!isDev) throw new Error(message);
    console.warn(`[csp] ${message}`);
    return null;
  }
}
