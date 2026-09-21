import type { NextConfig } from "next";

const securityHeaders = [

  { key: "X-Frame-Options", value: "DENY" },

  { key: "X-Content-Type-Options", value: "nosniff" },

  { key: "Referrer-Policy", value: "no-referrer" },

  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },

  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },

  /*
   * NOTE: the production `script-src` below is still `'self'` with no nonce,
   * and the App Router emits unnonced inline scripts carrying the RSC payload.
   * Those are blocked, so a production build does not hydrate. Fixing it needs
   * a per-request nonce issued from middleware and threaded into the policy.
   */
];

function contentSecurityPolicy() {
  const isDev = process.env.NODE_ENV === "development";
  const origin = graphOrigin(isDev);

  return [
    "default-src 'self'",
    `script-src 'self'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""}`,
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

function graphOrigin(isDev: boolean): string | null {
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

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: contentSecurityPolicy() },
        ],
      },
    ];
  },
};

export default nextConfig;
