import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JSON Parser - Export to Excel, TXT, Properties",
  description: "Parse JSON and export to Excel, TXT, and Properties files",
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

