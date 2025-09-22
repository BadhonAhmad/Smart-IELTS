import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart IELTS",
  description: "Your intelligent IELTS preparation companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
