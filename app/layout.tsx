import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const SITE_URL = "https://sns-post-generator.vercel.app";
const TITLE = "AI SNS投稿文ジェネレーター | X・Instagram・TikTok対応 30秒で5パターン生成";
const DESC = "サービス名を入力するだけでX・Instagram・TikTok・note・YouTube Shorts向けの投稿文をAIが自動生成。毎日の投稿ネタ切れを解消。¥980/月。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "AI SNS投稿文ジェネレーター",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
