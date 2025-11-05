import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db/drizzle";
import { pastes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

import { decryptCookie, safeEq } from "@/lib/secure-cookie";

import PastebinContent from "./components/pastebin-content";
import PinGate from "./components/pin-gate";

interface PastebinPageProps {
  params: Promise<{ id: string }>;
}

export default async function PastebinPage(props: PastebinPageProps) {
  const { id } = await props.params;
  const cookieHeaders = await cookies();

  const [paste] = await db
    .select({
      id: pastes.id,
      content: pastes.content,
      pinHash: pastes.pinHash,
      expiresAt: pastes.expiresAt,
      oneTime: pastes.oneTime,
      createdAt: pastes.createdAt,
      expired: sql<boolean>`(${pastes.expiresAt} is not null and ${pastes.expiresAt} <= now())`,
    })
    .from(pastes)
    .where(eq(pastes.id, id))
    .limit(1);

  if (!paste) notFound();

  if (paste.expired) {
    db.delete(pastes).where(eq(pastes.id, id)).returning().execute();
    notFound();
  }

  let unlocked = !paste.pinHash;

  if (!unlocked) {
    const raw = cookieHeaders.get(`paste:${id}:ok`)?.value;
    if (raw) {
      const payload = decryptCookie(raw);
      if (payload) {
        const idOk = safeEq(payload.id, id);
        unlocked = !paste.expired && idOk;
      }
    }
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col gap-8 text-pretty">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Protected Paste</h1>
          <PinGate id={id} />
        </div>
      </div>
    );
  }

  if (paste.oneTime) {
    db.delete(pastes).where(eq(pastes.id, id)).returning().execute();
  }

  const { pinHash, ...safePaste } = paste;

  return (
    <div className="flex flex-col gap-8 text-pretty">
      <PastebinContent paste={{ ...safePaste, protected: pinHash !== null }} />
    </div>
  );
}
