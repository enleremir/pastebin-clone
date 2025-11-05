import Link from "next/link";
import { FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center gap-3 text-pretty">
      <FileIcon strokeWidth={1} className="mx-auto mb-4 size-18 text-gray-300" />
      <h1 className="text-2xl font-bold">Paste not found</h1>
      <p className="text-muted-foreground text-center text-sm leading-relaxed">
        This paste isn&apos;t available anymore. Try creating a new one instead.
      </p>
      <Button asChild>
        <Link href="/">Create a new paste</Link>
      </Button>
    </main>
  );
}
