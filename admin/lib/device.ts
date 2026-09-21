/**
 * What the browser will actually tell us about the machine.
 *
 * Less than you would hope: no browser reports a manufacturer or model for a
 * desktop, so there is no "MacBook Pro" or "HP EliteBook" to read. The only
 * model string on offer is `userAgentData.getHighEntropyValues(["model"])`,
 * and that is populated on Android alone. What follows is the honest ceiling:
 * the platform and the browser.
 */

function platformName(): string {
  if (typeof navigator === "undefined") return "Unknown device";

  const ua = navigator.userAgent;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? "";

  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/CrOS/.test(ua)) return "Chromebook";
  if (platform === "Android" || /Android/.test(ua)) return "Android device";
  if (platform === "macOS" || /Macintosh|Mac OS X/.test(ua)) return "Mac";
  if (platform === "Windows" || /Windows/.test(ua)) return "Windows PC";
  if (platform === "Linux" || /Linux/.test(ua)) return "Linux PC";

  return "Unknown device";
}

/*
 * Order matters here, because these user agents lie about each other: Edge and
 * Opera both claim Chrome, and Chrome claims Safari. Most specific first.
 */
function browserName(): string {
  if (typeof navigator === "undefined") return "Browser";

  const ua = navigator.userAgent;

  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";

  return "Browser";
}

/** Something a person would recognise in a session list: "Mac · Chrome". */
export function deviceName(): string {
  return `${platformName()} · ${browserName()}`;
}

function timeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

/**
 * Everything the login-session row wants, in one call.
 *
 * `device_id` carries the same label as `device_name` — the backend takes the
 * description for both, so there is no separate identifier to mint.
 */
export function deviceContext() {
  const name = deviceName();

  return {
    device_id: name,
    device_name: name,
    timezone: timeZone(),
    datetime: new Date().toISOString(),
  };
}
