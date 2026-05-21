import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneeChan - Watch Anime Online in HD",
  description: "The ultimate destination for anime fans. Stream your favorite anime in high quality on OneeChan.",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 stroke=%22%2310b981%22 stroke-width=%222%22 fill=%22none%22 stroke-dasharray=%2210 5%22/><ellipse cx=%2250%22 cy=%2245%22 rx=%2218%22 ry=%2220%22 fill=%22%23fce4d6%22/><path d=%22M32 38C32 28 38 22 50 22C62 22 68 28 68 38C68 32 62 26 50 26C38 26 32 32 32 38Z%22 fill=%22%233d2b1f%22/><ellipse cx=%2242%22 cy=%2243%22 rx=%226%22 ry=%227%22 fill=%22white%22/><ellipse cx=%2242%22 cy=%2243%22 rx=%224.5%22 ry=%225.5%22 fill=%22%238B4513%22/><ellipse cx=%2242%22 cy=%2243%22 rx=%223%22 ry=%224%22 fill=%22%232d1b0e%22/><ellipse cx=%2240%22 cy=%2240.5%22 rx=%221.5%22 ry=%221.5%22 fill=%22white%22/><ellipse cx=%2258%22 cy=%2243%22 rx=%226%22 ry=%227%22 fill=%22white%22/><ellipse cx=%2258%22 cy=%2243%22 rx=%224.5%22 ry=%225.5%22 fill=%22%238B4513%22/><ellipse cx=%2258%22 cy=%2243%22 rx=%223%22 ry=%224%22 fill=%22%232d1b0e%22/><ellipse cx=%2256%22 cy=%2240.5%22 rx=%221.5%22 ry=%221.5%22 fill=%22white%22/><ellipse cx=%2236%22 cy=%2249%22 rx=%224%22 ry=%222.5%22 fill=%22%23ffb5c5%22 opacity=%220.5%22/><ellipse cx=%2264%22 cy=%2249%22 rx=%224%22 ry=%222.5%22 fill=%22%23ffb5c5%22 opacity=%220.5%22/><path d=%22M47 51C48 53 52 53 53 51%22 stroke=%22%23c44%22 stroke-width=%221.2%22 stroke-linecap=%22round%22 fill=%22none%22/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
    >
      <body className="bg-background text-foreground min-h-screen selection:bg-accent/30">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
