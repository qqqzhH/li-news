import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TabTitleTrick from "@/components/TabTitleTrick";
import EasterEggs from "@/components/EasterEggs";

export const metadata: Metadata = {
  title: "\u6728\u5b50\u65b0\u95fb | LI News",
  description: "\u4f60\u7684\u4e2a\u4eba\u667a\u80fd\u65b0\u95fb\u7ad9 \u2014 AI\u3001\u5730\u7f18\u653f\u6cbb\u3001\u91d1\u878d\u5e02\u573a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <TabTitleTrick />
          <EasterEggs />
          <main className="flex-1 min-w-0 w-full p-4 md:p-6 lg:p-8 md:ml-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
