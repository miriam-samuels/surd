"use client";

import { ClientError, GraphQLClient } from "graphql-request";
import { APIError, type IResponse } from "@/types/api";
import { clearToken, getToken, hasToken, setToken } from "@/api/session-token";

export const ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "";

/**
 * Every operation POSTs to the same `/graph/entrypoint`, so the network panel
 * shows a stack of identical rows and you have to open each one to find out
 * what it was. Tagging the URL with the operation name makes the panel readable
 * at a glance — `entrypoint?op=AdminOverviewMetrics`.
 *
 * Development only. A GraphQL server ignores the query string on a POST, but
 * that is the backend's choice rather than ours, so production keeps the bare
 * endpoint and this stays a debugging aid.
 */
const LABEL_REQUESTS = process.env.NODE_ENV === "development";

export const graphQLClient = new GraphQLClient(ENDPOINT, {
  headers: (): Record<string, string> => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  requestMiddleware: (request) =>
    LABEL_REQUESTS && request.operationName
      ? { ...request, url: `${request.url}?op=${request.operationName}` }
      : request,
});



type Body = Record<string, IResponse | undefined>;

// get body of response and transform it for easy access
async function send(document: string, input: unknown, signal?: AbortSignal) {
  try {
    return await graphQLClient.rawRequest<Body, Record<string, unknown>>({
      query: document,
      variables: input === undefined ? {} : { input },
      signal,
    });
  } catch (caught) {
    if (caught instanceof ClientError) {
      if (caught.response?.data) {
        return {
          data: caught.response.data as Body,
          headers: caught.response.headers,
        };
      }

      // graphql specific errors
      const rejected = caught.response?.errors?.[0]?.message;
      if (rejected) throw new APIError(rejected);
    }

    throw new APIError(
      "We couldn't reach the server. Check your connection and try again.",
    );
  }
}


/**
 * The API serialises its `Decimal` money fields as an object rather than a bare
 * number — `total_funds` arrives as
 * `{ source: "7.43941872e+06", parsedValue: 7439418.72 }` — and it does so field
 * by field, so one resolver mixes both shapes: `total_funds` is an object while
 * `total_roi_liability` beside it is a plain number.
 *
 * Collapsing it here rather than at each call site is what keeps every `number`
 * in `types/` honest. Left alone, an object reaches `formatMoney` and renders
 * `[object Object]`, and any arithmetic on it — the donut's percentages, its
 * total — yields NaN. Doing it in transport also means a field the backend later
 * switches to `Decimal` keeps working without a matching UI change.
 *
 * `parsedValue` is the number the server parsed itself; `source` is the
 * exponent-notation string it came from and is a debugging aid only.
 */
const DECIMAL_KEYS = new Set(["parsedValue", "source", "__typename"]);

function isDecimal(value: Record<string, unknown>) {
  return (
    typeof value.parsedValue === "number" &&
    Object.keys(value).every((key) => DECIMAL_KEYS.has(key))
  );
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (isDecimal(record)) return record.parsedValue as number;

    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(record)) out[key] = normalize(item);
    return out;
  }

  return value;
}


export async function request<TData>(
  document: string,
  resolver: string,
  input?: unknown,
  signal?: AbortSignal,
): Promise<IResponse<TData>> {
  const { data, headers } = await send(document, input, signal);

  const rotated = headers?.get("X-Authorization");
  if (rotated) setToken(rotated, { rotate: true });

  const payload = data?.[resolver];

  if (!payload || payload.__typename === "Error") {
 
    if (payload?.status === 401 && hasToken()) clearToken("unauthorized");

    throw new APIError(
      payload?.message || "The server returned an empty response.",
      payload?.code,
      payload?.status,
    );
  }

  return normalize(payload) as IResponse<TData>;
}
