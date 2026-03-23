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
          // Primary brand colors
          colorPrimary: "#a78bfa",
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          colorDanger: "#ef4444",
          colorShades: {
            "50": "#f9f5ff",
            "100": "#f3e8ff",
            "200": "#e9d5ff",
            "300": "#d8b4fe",
            "400": "#c084fc",
            "500": "#a855f7",
            "600": "#9333ea",
            "700": "#7e22ce",
            "800": "#6b21a8",
            "900": "#581c87",
          },

          // Background & Text
          colorBackground: "#0f0f1e",
          colorText: "#f5f5f5",
          colorTextSecondary: "#d1d5db",
          colorTextTertiary: "#9ca3af",

          // Input styling - improved contrast
          colorInputBackground: "#1f1f35",
          colorInputText: "#f5f5f5",
          colorInputBorder: "#3f3f5f",

          // Neutral colors
          colorNeutral: "#6b7280",

          // Borders and spacing
          borderRadius: "0.75rem",
          spacingUnit: "1rem",

          // Shadows for depth
          colorShadow: "rgba(0, 0, 0, 0.5)",

          // Button styling
          colorButtonBackground: "#a78bfa",
          colorButtonText: "#ffffff",
          colorButtonPrimaryText: "#ffffff",
          colorButtonHoverBackground: "#c4b5fd",
        },
        elements: {
          // Form container
          rootBox: "background-color: #0f0f1e; min-height: 100vh; display: flex; align-items: center; justify-content: center;",

          // Card styling
          card: "background-color: #1a1a2e; border: 1px solid #3f3f5f; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);",
          cardBox: "gap: 2rem;",

          // Header styling
          headerTitle: "font-size: 1.875rem; font-weight: 700; color: #f5f5f5; letter-spacing: -0.02em;",
          headerSubtitle: "color: #d1d5db; font-size: 0.95rem;",

          // Form elements
          formFieldLabel: "color: #d1d5db; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem;",
          formFieldInput: "background-color: #252540; color: #f5f5f5; border: 1.5px solid #3f3f5f; border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 1rem; transition: all 0.2s ease;",
          formFieldInputShowPasswordButton: "color: #a78bfa;",

          // Focus states
          formFieldInputFocus: "border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1); outline: none;",

          // Buttons - Primary
          button: "background-color: #a78bfa; color: #ffffff; font-weight: 600; padding: 0.875rem 1.5rem; border-radius: 0.75rem; border: none; cursor: pointer; transition: all 0.2s ease; font-size: 1rem;",
          buttonPrimary: "background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3); hover: background-color: #c4b5fd; hover: box-shadow: 0 6px 20px rgba(167, 139, 250, 0.4);",
          buttonPrimaryHover: "background: linear-gradient(135deg, #c084fc 0%, #d8b4fe 100%); box-shadow: 0 8px 25px rgba(167, 139, 250, 0.5);",

          // Buttons - Secondary
          buttonSecondary: "background-color: #2a2a3e; color: #f5f5f5; border: 1.5px solid #3f3f5f; hover: background-color: #3f3f5f;",
          buttonSecondaryHover: "background-color: #3f3f5f; border-color: #5f5f7f;",

          // Buttons - Social
          socialButton: "background-color: #1f1f35; border: 1.5px solid #3f3f5f; color: #f5f5f5; border-radius: 0.75rem; padding: 0.875rem; font-weight: 500;",
          socialButtonHover: "background-color: #252540; border-color: #a78bfa;",

          // Divider
          dividerLine: "background-color: #3f3f5f;",
          dividerText: "color: #9ca3af;",

          // Links
          linkColor: "#a78bfa",
          linkColorHover: "#c4b5fd",

          // Error states
          formFieldErrorText: "color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;",
          formFieldErrorBorder: "border-color: #ef4444;",

          // Success states
          formFieldSuccessBorder: "border-color: #10b981;",

          // Loading
          spinnerColor: "#a78bfa",

          // Footer
          footerActionLink: "color: #a78bfa; text-decoration: none; font-weight: 500;",
          footerActionLinkHover: "color: #c4b5fd;",
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
