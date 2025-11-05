"use client";

import { Paste } from "@/db/schema";
import { formatDistanceStrict, isPast } from "date-fns";
import { CheckIcon, CopyIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const metaCls = "text-muted-foreground font-mono text-sm whitespace-nowrap";

function relativeLabel(target: Date, opts: { pastPrefix: string; futurePrefix: string }) {
  const past = isPast(target);
  const dist = formatDistanceStrict(new Date(), target);
  return past ? `${opts.pastPrefix} ${dist} ago` : `${opts.futurePrefix} ${dist}`;
}

function ExpirationLabel({ expiresAt, oneTime }: { expiresAt: Date | null; oneTime: boolean }) {
  let text: string;

  if (oneTime) {
    text = "One-time view";
  } else if (!expiresAt) {
    text = "Never expires";
  } else {
    text = relativeLabel(expiresAt, { pastPrefix: "Expired", futurePrefix: "Expires in" });
  }

  return (
    <span className={metaCls} suppressHydrationWarning>
      {text}
    </span>
  );
}

function CreatedAtLabel({ createdAt }: { createdAt: Date }) {
  const text = relativeLabel(createdAt, { pastPrefix: "Created", futurePrefix: "Created in" });
  return (
    <span className={metaCls} suppressHydrationWarning>
      {text}
    </span>
  );
}

interface PastebinContentProps {
  paste: Omit<Paste, "pinHash"> & { protected: boolean };
}

export default function PastebinContent({ paste }: PastebinContentProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Paste {paste.id}</h1>
      <span className="text-muted-foreground text-sm">
        <ExpirationLabel expiresAt={paste.expiresAt} oneTime={paste.oneTime} />
      </span>
      <div className="relative">
        <ScrollArea className="bg-muted h-80 rounded-md border p-2">
          <pre className="text-muted-foreground text-sm leading-relaxed whitespace-break-spaces">
            {paste.content}
          </pre>
        </ScrollArea>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => {
                copyToClipboard(paste.content);
                toast.success("Content copied to clipboard.");
              }}
            >
              <span className="sr-only">Copy content</span>
              {isCopied ? (
                <CheckIcon className="size-4 text-emerald-600" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Copy content</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center justify-between">
        <CreatedAtLabel createdAt={paste.createdAt} />
        {paste.protected && (
          <div className="text-muted-foreground flex items-center gap-1 font-mono text-sm">
            <ShieldCheckIcon className="size-4 animate-pulse text-emerald-600" />
            <span className="whitespace-nowrap">Protected Paste</span>
          </div>
        )}
      </div>
    </div>
  );
}
