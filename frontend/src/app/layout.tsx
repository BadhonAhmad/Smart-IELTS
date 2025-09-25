import type { Metadata } from "next";
import "./globals.css";
import FloatingChatbotLeft from "@/components/FloatingChatbotLeft";

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
