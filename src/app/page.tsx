import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { RadialStackSpinner } from "./components/radial-stack-spinner";

export default function Page() {
  return (
    <section className="flex flex-1 flex-col items-center justify-between gap-10">
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <Badge variant="outline">Vienna, Austria</Badge>
        <Badge variant="outline">Sunny 35°C</Badge>
      </div>
      <div className="flex flex-col items-center gap-6 lg:max-w-xl">
        <h2 className="title-30 items-center text-center">
          Paste it. Share it. Forget it existed.
        </h2>
        <p className="title-20 inline-flex items-center gap-2">
          <span>Chaos</span>
          <span className="relative -top-[3px] leading-none">→</span>
          <span>Copy</span>
          <span className="relative -top-[3px] leading-none">→</span>
          <span>Peace.</span>
        </p>
        <Button asChild>
          <Link href="/paste">Get Started</Link>
        </Button>
      </div>
      <div className="aspect-square h-[330px] w-auto lg:aspect-video lg:h-auto lg:w-full lg:max-w-[1440px]">
        <RadialStackSpinner />
      </div>
      <h2 className="title-30 pb-10 lg:py-10">PasteBin</h2>
    </section>
  );
}
