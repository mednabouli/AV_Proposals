import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
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
      ui={ui}
      appearance={{
        variables: {
          colorPrimary: "#a78bfa",
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          colorDanger: "#ef4444",
          colorBackground: "#0f0f1e",
          borderRadius: "0.75rem",
        },
        elements: {
          cardBox: "w-full max-w-md mx-auto",
          card: "!bg-[#1a1a2e] !border !border-[#3f3f5f] shadow-[0_20px_60px_rgba(0,0,0,0.8)] !text-[#f5f5f5]",
          userButtonPopoverCard: "!bg-[#1a1a2e] !border !border-[#3f3f5f] !text-[#f5f5f5]",
          userButtonPopoverActionButtonText: "!text-[#f5f5f5]",
          userPreviewSecondaryIdentifier: "!text-[#9ca3af]",
          userPreviewMainIdentifier: "!text-[#f5f5f5] font-medium",
          userProfileCard: "!bg-[#1a1a2e] !border !border-[#3f3f5f] !text-[#f5f5f5]",
          navbarButton: "!text-[#d1d5db] hover:!text-[#f5f5f5] hover:!bg-[#252540]",
          profileSectionTitle: "!text-[#f5f5f5] font-semibold",
          profilePageTitle: "!text-[#f5f5f5] font-bold",
          modalContent: "!bg-[#1a1a2e] !text-[#f5f5f5]",
          pageScrollBox: "!bg-[#0f0f1e]",
          badge: "!bg-[#252540] !text-[#d1d5db]",
          headerTitle: "!text-[#f5f5f5] text-2xl font-bold tracking-tight",
          headerSubtitle: "!text-[#d1d5db]",
          formFieldLabel: "!text-[#d1d5db] font-medium",
          formFieldInput: "!bg-[#252540] !border-[#3f3f5f] !text-[#f5f5f5] focus:!border-[#a78bfa] focus:!ring-1 focus:!ring-[#a78bfa]",
          formButtonPrimary: "!bg-gradient-to-r from-[#a78bfa] to-[#c084fc] hover:from-[#c084fc] hover:to-[#d8b4fe] !text-white shadow-lg shadow-[#a78bfa]/20",
          socialButtonsBlockButton: "!bg-[#1f1f35] !border !border-[#3f3f5f] hover:!bg-[#252540] hover:!border-[#a78bfa] transition-colors",
          socialButtonsBlockButtonText: "!text-[#f5f5f5] font-semibold",
          dividerLine: "!bg-[#3f3f5f]",
          dividerText: "!text-[#9ca3af]",
          footerActionText: "!text-[#9ca3af]",
          footerActionLink: "!text-[#a78bfa] hover:!text-[#c4b5fd] font-medium transition-colors",
          formFieldInputShowPasswordButton: "!text-[#a78bfa] hover:!text-[#c4b5fd]",
          formFieldErrorText: "!text-[#ef4444] text-sm mt-1",
          formFieldSuccessText: "!text-[#10b981] text-sm mt-1",
          formFieldInfoText: "!text-[#d1d5db] text-xs",
          identityPreviewText: "!text-[#f5f5f5]",
          identityPreviewEditButtonIcon: "!text-[#a78bfa] hover:!text-[#c4b5fd]",
        },
      }}
    >
      <html
        lang="fr"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body
          className="min-h-full flex flex-col bg-[#0f0f1e] text-[#f5f5f5]"
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
