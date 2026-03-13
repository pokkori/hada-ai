import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const SITE_URL = "https://hada-ai.vercel.app";
const TITLE = "AI美肌診断 | あなたの肌タイプを分析してパーソナルスキンケアを提案";
const DESC = "肌の悩みを入力するだけでAIが肌タイプを詳細分析。朝・夜のスキンケアルーティン・注目成分・コスパ商品レコメンドまで。無料3回試せる。¥980/月。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "AI美肌診断",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "AI美肌診断",
      "url": SITE_URL,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "980", "priceCurrency": "JPY", "description": "プレミアムプラン ¥980/月" },
      "description": DESC,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "どんな肌の悩みに対応していますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "乾燥肌・脂性肌・混合肌・敏感肌・ニキビ・毛穴・シミ・くすみ・シワなど、幅広い肌悩みに対応しています。肌タイプを詳細分析し、朝・夜のスキンケアルーティンと注目成分を提案します。"
          }
        },
        {
          "@type": "Question",
          "name": "商品レコメンドはどんな基準で選ばれますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AIがあなたの肌タイプと悩みに合わせて、有効成分・価格帯・使いやすさを総合的に評価してコスパの良い商品を選定します。特定ブランドとの広告契約はなく、客観的な分析に基づき提案しています。"
          }
        },
        {
          "@type": "Question",
          "name": "無料で使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "登録不要で3回分の美肌診断を無料でお試しいただけます。プレミアムプラン（¥980/月）で診断回数無制限・詳細スキンケアルーティン・成分解析レポートが利用可能になります。"
          }
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geist.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
