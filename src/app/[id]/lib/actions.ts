"use server";

import { cookies } from "next/headers";
import { db } from "@/db/drizzle";
import { pastes } from "@/db/schema";
import { compare } from "bcryptjs";
import { eq, sql } from "drizzle-orm";

import { actionClient } from "@/lib/safe-action";
import { encryptCookie } from "@/lib/secure-cookie";

import { verifyPastebinSchema } from "./validations";

export const verifyPastebin = actionClient
  .inputSchema(verifyPastebinSchema)
  .action(async ({ parsedInput: { id, pin } }) => {
    const [paste] = await db
      .select({
        id: pastes.id,
        pinHash: pastes.pinHash,
        expiresAt: pastes.expiresAt,
        expired: sql<boolean>`(${pastes.expiresAt} is not null and ${pastes.expiresAt} <= now())`,
        nowEpoch: sql<number>`extract(epoch from now())::bigint`,
      })
      .from(pastes)
      .where(eq(pastes.id, id))
      .limit(1);

    if (!paste) return { success: false, message: "Paste not found." };

    if (paste.expired) {
      await db.delete(pastes).where(eq(pastes.id, id)).returning().execute();
      return { success: false, message: "Paste has expired." };
    }

    if (paste.pinHash) {
      const ok = await compare(pin, paste.pinHash);
      if (!ok)
        return {
          success: false,
          message: "Incorrect PIN provided.",
        };
    }

    const now = Math.floor(Date.now() / 1000);
    const maxTtl = 60 * 60 * 24;
    const ttl = paste.expiresAt
      ? Math.max(0, Math.floor(paste.expiresAt.getTime() / 1000) - now)
      : maxTtl;
    const maxAge = Math.min(ttl, maxTtl);
    const exp = now + maxAge;

    const payload = {
      id,
      exp,
      jti: cryptoRandom(),
    };

    const value = encryptCookie(payload);

    if (maxAge > 0) {
      const cookieHeaders = await cookies();
      cookieHeaders.set(`paste:${id}:ok`, value, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: `/`,
        maxAge: exp - now,
      });
    }

    return { success: true };
  });

function cryptoRandom() {
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Buffer.from(arr).toString("base64url");
}
