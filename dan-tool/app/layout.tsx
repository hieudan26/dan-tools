import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dan Tools - Developer Tools Collection",
  description: "Collection of useful developer tools",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

