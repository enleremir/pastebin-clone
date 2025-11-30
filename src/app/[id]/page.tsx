import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/drizzle";
import { pastes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

import { decryptCookie, safeEq } from "@/lib/secure-cookie";
import { Button } from "@/components/ui/button";

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
      <section className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <Button asChild variant="secondary" className="w-min">
            <Link href="/">Go Back</Link>
          </Button>
          <h2 className="title-30">PasteBin</h2>
          <p className="title-20 text-center text-[2.25rem]">
            Share code and text snippets instantly!
          </p>
        </div>
        <PinGate id={id} />
      </section>
    );
  }

  if (paste.oneTime) {
    db.delete(pastes).where(eq(pastes.id, id)).returning().execute();
  }

  const { pinHash, ...safePaste } = paste;

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-6">
      <div className="flex flex-col items-center gap-4">
        <Button asChild variant="secondary" className="w-min">
          <Link href="/">Go Back</Link>
        </Button>
        <h2 className="title-30">PasteBin</h2>
        <p className="title-20 text-center text-[2.25rem]">
          Share code and text snippets instantly!
        </p>
      </div>
      <PastebinContent paste={{ ...safePaste, protected: pinHash !== null }} />
    </section>
  );
}
