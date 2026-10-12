import { Analytics } from "@vercel/analytics/next";

import type { Metadata, Viewport } from "next";

import { Plus_Jakarta_Sans } from "next/font/google";

import { ProtectedRoute } from "../route_protection/ProtectedRoute";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xenon | School Management System",
  description:
    "A connected command center for modern school operations, academics, people, and finance.",
  generator: "Xenon SMS",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#121a28" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-background scroll-smooth overflow-x-clip w-full max-w-full"
      suppressHydrationWarning
    >
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased w-full max-w-full overflow-x-clip`}
        suppressHydrationWarning
      >
        <ProtectedRoute>{children}</ProtectedRoute>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
