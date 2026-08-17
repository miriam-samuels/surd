/**
 * AES-GCM helpers for values held in sessionStorage.
 *
 * NOTE: `NEXT_SECURE_KEY` has no `NEXT_PUBLIC_` prefix, so it is **undefined in
 * the browser** — and this module runs in the browser (it uses `window.crypto`
 * and `sessionStorage`). Today every value is therefore derived from the
 * literal string "undefined". Prefixing the variable would fix the lookup but
 * ship the key to every visitor, which is worse; the real fix is to keep the
 * key server-side and encrypt/decrypt behind a route handler. Flagged rather
 * than silently changed.
 */

/** What `encrypt` returns and `decrypt` expects back. */
export type EncryptedValue = {
  data: string;
  iv: string;
};

/** The envelope produced by the backend's AES-GCM cipher. */
export type CipherPayload = {
  iv: string;
  authTag: string;
  content: string;
};

async function generateKeyFromPassword(password: string) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const key = await window.crypto.subtle.digest('SHA-256', passwordBuffer);

  return window.crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

const uint8ArrayToBase64 = (arr: Uint8Array) => btoa(String.fromCharCode(...arr));

const base64ToUint8Array = (base64: string) => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

// Encrypt
export const encrypt = async (value: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await generateKeyFromPassword(`${process.env.NEXT_SECURE_KEY}`);

  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data);
  const encryptedArray = new Uint8Array(encrypted);

  return {
    data: uint8ArrayToBase64(encryptedArray),
    iv: uint8ArrayToBase64(iv),
  };
};

// Decrypt
export const decrypt = async (encryptedData: { data: string; iv: string }) => {
  const value = base64ToUint8Array(encryptedData.data);
  const iv = base64ToUint8Array(encryptedData.iv);
  const key = await generateKeyFromPassword(`${process.env.NEXT_SECURE_KEY}`);

  const decryptedData = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, value);

  return new TextDecoder().decode(decryptedData);
};

/**
 * Decrypts a backend cipher envelope.
 *
 * The caller knows the shape of what was encrypted, so the payload type is a
 * parameter — `decryptCipher<UserProfile>(payload)` — rather than `any`.
 */
export async function decryptCipher<T>(encryptedData: CipherPayload): Promise<T> {
  const decoder = new TextDecoder();

  // Decode Base64 to ArrayBuffer
  const keyBuffer = Uint8Array.from(atob(`${process.env.NEXT_SECURE_KEY}`), c => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
  const authTagBuffer = Uint8Array.from(atob(encryptedData.authTag), c => c.charCodeAt(0));
  const contentBuffer = Uint8Array.from(atob(encryptedData.content), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey('raw', keyBuffer, 'AES-GCM', false, ['decrypt']);

  const combinedBuffer = new Uint8Array([...contentBuffer, ...authTagBuffer]);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer,
    },
    key,
    combinedBuffer
  );

  const decryptedText = decoder.decode(decrypted);
  return JSON.parse(decryptedText) as T;
}

export const encryptObject = async (obj: Record<string, string>) => {
  const newObject: Record<string, EncryptedValue> = {};

  for (const key in obj) {
    //TODO: check for data type
    newObject[key] = await encrypt(obj[key]);
  }

  // return data
  return newObject;
};

export const store = {
  set: async (name: string, value: unknown) => {
    const strigified = JSON.stringify(value);
    const encrypted = await encrypt(strigified);
    sessionStorage.setItem(name, JSON.stringify(encrypted));
  },
  /** Callers declare what they stored: `store.get<Session>("session")`. */
  get: async <T>(name: string): Promise<T | undefined> => {
    const data = sessionStorage.getItem(name);
    if (!data) return undefined;
    try {
      const parsed = JSON.parse(data) as EncryptedValue;
      const decrypted = await decrypt(parsed);
      return JSON.parse(decrypted) as T;
    } catch {
      /* Corrupt or key-rotated entry — drop it rather than keep failing. */
      sessionStorage.removeItem(name);
      return undefined;
    }
  },
  remove: (name: string) => {
    sessionStorage.removeItem(name);
  },
  clear: () => {
    sessionStorage.clear();
  },
  check: (name: string) => {
    const data = sessionStorage.getItem(name);
    return Boolean(data);
  },
};
