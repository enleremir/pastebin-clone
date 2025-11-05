import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from "crypto";
import { env } from "@/env";

const keyB64 = env.PASTE_COOKIE_KEY;
const KEY = Buffer.from(keyB64, "base64");

const b64 = (buffer: Buffer) => buffer.toString("base64url");
const ub64 = (str: string) => Buffer.from(str, "base64url");

type Payload = { id: string; exp: number; jti: string };

export function encryptCookie(payload: Payload): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  const pt = Buffer.from(JSON.stringify(payload));
  const ct = Buffer.concat([cipher.update(pt), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${b64(iv)}.${b64(ct)}.${b64(tag)}`;
}

export function decryptCookie(value: string): Payload | null {
  const [ivB64, ctB64, tagB64] = value.split(".");
  if (!ivB64 || !ctB64 || !tagB64) return null;
  const iv = ub64(ivB64);
  const ct = ub64(ctB64);
  const tag = ub64(tagB64);
  const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return JSON.parse(pt.toString()) as Payload;
}

export function safeEq(a: string, b: string) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}
