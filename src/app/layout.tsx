import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVProposal.ai — Générateur de devis AV intelligent",
  description:
    "Transformez un brief client en proposition professionnelle en moins de 10 minutes. Pour les freelances vidéo et agences AV à Montréal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7c5cfc",
          colorBackground: "#1a1a2e",
          colorText: "#f5f5f5",
          colorInputBackground: "#252540",
          colorInputText: "#f5f5f5",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html
        lang="fr"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
