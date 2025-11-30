import type { Metadata } from "next";
import { Fragment_Mono, Instrument_Serif, Space_Mono } from "next/font/google";

import "./globals.css";

import { PartyPopperIcon } from "lucide-react";

import { Marquee } from "@/components/ui/marquee";
import { Toaster } from "@/components/ui/sonner";

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  weight: ["400"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: ["400"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Pastebin - Minimal, Secure Pastebin",
    template: "%s - Pastebin",
  },
  description:
    "Create, share, and protect your text snippets with Pastebin - a minimal, privacy-focuesed pastebin supporting PIN protection and automatic expiration.",
  keywords: ["pastebin", "text sharing", "secure paste", "temporaty text"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const marqueeItems = [
    "no logins. no drama. no questions asked.",
    "just your pasted text. and only for a while.",
    "like alchemy for unhinged notes.",
    "want magic? we tried our best.",
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fragmentMono.variable} ${instrumentSerif.variable} ${spaceMono.variable} h-dvh font-serif antialiased`}
      >
        <main className="flex min-h-dvh flex-col">
          {children}
          <Marquee items={marqueeItems} />
        </main>

        <Toaster
          icons={{
            success: <PartyPopperIcon className="size-4" />,
          }}
        />
      </body>
    </html>
  );
}
