import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

import Link from "next/link";
import { PartyPopperIcon } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";

import { ThemeToggle } from "./components/theme-toggle";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CloneBin - Minimal, Secure Pastebin",
    template: "%s - CloneBin",
  },
  description:
    "Create, share, and protect your text snippets with CloneBin - a minimal, privacy-focuesed pastebin supporting PIN protection and automatic expiration.",
  keywords: ["pastebin", "text sharing", "secure paste", "temporaty text"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoMono.variable} h-dvh font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="container mx-auto flex h-full max-w-lg flex-col justify-center gap-10 px-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-5xl font-semibold">
                Clone<span className="text-primary">Bin</span>
              </Link>
              <ThemeToggle />
            </div>

            {children}
          </main>
          <Toaster
            icons={{
              success: <PartyPopperIcon className="size-4" />,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
