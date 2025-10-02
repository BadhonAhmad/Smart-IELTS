import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

// Dynamically import FloatingChatbotLeft to prevent hydration mismatch
const FloatingChatbotLeft = dynamic(() => import("@/components/FloatingChatbotLeft"));

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
      <body className="antialiased">
        {children}
        <FloatingChatbotLeft />
      </body>
    </html>
  );
}
