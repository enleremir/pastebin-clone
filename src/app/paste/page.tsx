import Link from "next/link";

import { Button } from "@/components/ui/button";

import PastebinForm from "../components/pastebin-form";

export default function Page() {
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
      <PastebinForm />
    </section>
  );
}
