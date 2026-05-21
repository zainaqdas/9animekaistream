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
  title: "ONEECHAN - Watch Anime Online in HD",
  description: "The ultimate destination for anime fans. Stream your favorite anime in high quality on ONEECHAN.",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 stroke=%22%2310b981%22 stroke-width=%222%22 fill=%22none%22/><path d=%22M30 30C15 10 5 40 25 50%22 stroke=%22%23065f46%22 stroke-width=%226%22 stroke-linecap=%22round%22/><path d=%22M70 30C85 10 95 40 75 50%22 stroke=%22%23065f46%22 stroke-width=%226%22 stroke-linecap=%22round%22/><circle cx=%2250%22 cy=%2250%22 r=%2222%22 fill=%22%2310b981%22/><circle cx=%2250%22 cy=%2250%22 r=%2215%22 fill=%22%2334d399%22/><circle cx=%2245%22 cy=%2245%22 r=%225%22 fill=%22white%22 opacity=%220.8%22/></svg>',
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
