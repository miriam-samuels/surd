const SECURE_KEY =
  process.env.NEXT_PUBLIC_SECURE_KEY ??
  process.env.NEXT_SECURE_KEY ??
  "surd-admin-fallback-key";

if (
  process.env.NODE_ENV === "development" &&
  !process.env.NEXT_PUBLIC_SECURE_KEY &&
  !process.env.NEXT_SECURE_KEY
) {
  console.warn(
    "[secure] NEXT_PUBLIC_SECURE_KEY is not set - session storage is using the fallback key.",
  );
}

export type EncryptedValue = {
  data: string;
  iv: string;
};

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

export const encrypt = async (value: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await generateKeyFromPassword(SECURE_KEY);

  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data);
  const encryptedArray = new Uint8Array(encrypted);

  return {
    data: uint8ArrayToBase64(encryptedArray),
    iv: uint8ArrayToBase64(iv),
  };
};

export const decrypt = async (encryptedData: { data: string; iv: string }) => {
  const value = base64ToUint8Array(encryptedData.data);
  const iv = base64ToUint8Array(encryptedData.iv);
  const key = await generateKeyFromPassword(SECURE_KEY);

  const decryptedData = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, value);

  return new TextDecoder().decode(decryptedData);
};

export async function decryptCipher<T>(encryptedData: CipherPayload): Promise<T> {
  const decoder = new TextDecoder();

  const keyBuffer = Uint8Array.from(atob(SECURE_KEY), c => c.charCodeAt(0));
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
    newObject[key] = await encrypt(obj[key]);
  }

  return newObject;
};

export const store = {
  set: async (name: string, value: unknown) => {
    const strigified = JSON.stringify(value);
    const encrypted = await encrypt(strigified);
    sessionStorage.setItem(name, JSON.stringify(encrypted));
  },

  get: async <T>(name: string): Promise<T | undefined> => {
    const data = sessionStorage.getItem(name);
    if (!data) return undefined;
    try {
      const parsed = JSON.parse(data) as EncryptedValue;
      const decrypted = await decrypt(parsed);
      return JSON.parse(decrypted) as T;
    } catch {
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
