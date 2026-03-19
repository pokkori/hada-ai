"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";
import { track } from '@vercel/analytics';

const FREE_LIMIT = 3;
const KEY = "hada_count";

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "肌診断", icon: "🔬" },
    { key: "スキンケアルーティン", icon: "📋" },
    { key: "注目成分", icon: "🧪" },
    { key: "商品レコメンド", icon: "🛒" },
    { key: "1週間後", icon: "📅" },
  ];
  const sections: Section[] = [];
  const parts = text.split(/^---$/m);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const matched = sectionDefs.find(s => trimmed.includes(s.key));
    if (matched) {
      const content = trimmed.replace(/^##\s.*$/m, "").trim();
      sections.push({ title: matched.key, icon: matched.icon, content });
    }
  }
  if (sections.length === 0) sections.push({ title: "診断結果", icon: "📄", content: text });
  return { sections, raw: text };
}

function Paywall({ onClose }: { onClose: () => void; onOpenPayjp?: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        <div className="text-3xl mb-3">⭐</div>
        <h2 className="text-lg font-bold mb-2">無料枠を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-4">プレミアムプランで全機能を使えます</p>
        <KomojuButton
          planId="standard"
          planLabel="プレミアム ¥1,980/月を始める"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 mt-3 block w-full">閉じる</button>
      </div>
    </div>
  );
}

function CopyButton({ text, label = "コピー" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors"
      >
        {copied ? "✓ コピー済み" : label}
      </button>
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg animate-bounce">
          ✅ コピー完了！
        </div>
      )}
    </div>
  );
}

// 肌タイプ別アフィリエイトリンク設定
const AFFILIATE_LINKS: Record<string, { label: string; url: string; desc: string }[]> = {
  "乾燥": [
    { label: "セラミド配合 保湿化粧水をAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E3%82%BB%E3%83%A9%E3%83%9F%E3%83%89+%E4%BF%9D%E6%B9%BF+%E5%8C%96%E7%B2%A7%E6%B0%B4&i=beauty", desc: "セラミド1,3,6-II配合でバリア機能を直接補修" },
    { label: "低刺激 保湿クリームをAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E4%BF%9D%E6%B9%BF+%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0+%E4%B9%BE%E7%87%A5%E8%82%8C+%E3%82%B7%E3%82%A2%E3%83%90%E3%82%BF%E3%83%BC&i=beauty", desc: "シアバター・スクワラン配合でしっかり油分フタ" },
  ],
  "脂性": [
    { label: "BHA（サリチル酸）配合 トナーをAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%AA%E3%83%81%E3%83%AB%E9%85%B8+%E6%AF%9B%E7%A9%B4+%E3%83%88%E3%83%8A%E3%83%BC&i=beauty", desc: "毛穴詰まり・ニキビ菌を溶解する定番成分" },
    { label: "ナイアシンアミド配合 美容液をAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E3%83%8A%E3%82%A4%E3%82%A2%E3%82%B7%E3%83%B3%E3%82%A2%E3%83%9F%E3%83%89+%E7%BE%8E%E5%AE%B9%E6%B6%B2&i=beauty", desc: "皮脂抑制・毛穴縮小・ニキビ跡改善の万能成分" },
  ],
  "混合": [
    { label: "ナイアシンアミド配合 美容液をAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E3%83%8A%E3%82%A4%E3%82%A2%E3%82%B7%E3%83%B3%E3%82%A2%E3%83%9F%E3%83%89+%E7%BE%8E%E5%AE%B9%E6%B6%B2&i=beauty", desc: "混合肌のTゾーン皮脂コントロールに最適" },
    { label: "セラミド配合 保湿化粧水をAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E3%82%BB%E3%83%A9%E3%83%9F%E3%83%89+%E4%BF%9D%E6%B9%BF+%E5%8C%96%E7%B2%A7%E6%B0%B4&i=beauty", desc: "乾燥しやすいUゾーンのバリア機能をケア" },
  ],
  "敏感": [
    { label: "低刺激 敏感肌用 化粧水をAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E6%95%8F%E6%84%9F%E8%82%8C+%E5%8C%96%E7%B2%A7%E6%B0%B4+%E7%84%A1%E9%A6%99%E6%96%99+%E4%BD%8E%E5%88%BA%E6%BF%80&i=beauty", desc: "無香料・無着色・ノンコメドジェニックのやさしい処方" },
    { label: "パンテノール（ビタB5）配合 美容液をAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E3%83%91%E3%83%B3%E3%83%86%E3%83%8E%E3%83%BC%E3%83%AB+%E7%BE%8E%E5%AE%B9%E6%B6%B2+%E6%95%8F%E6%84%9F%E8%82%8C&i=beauty", desc: "炎症を鎮静し傷ついた肌バリアを修復" },
  ],
  "default": [
    { label: "人気スキンケアランキングをAmazonで見る", url: "https://www.amazon.co.jp/s?k=%E3%82%B9%E3%82%AD%E3%83%B3%E3%82%B1%E3%82%A2+%E5%8C%96%E7%B2%A7%E6%B0%B4&i=beauty&s=review-rank", desc: "レビュー高評価のスキンケアを選んでください" },
    { label: "プチプラ美容液セットをAmazonで探す", url: "https://www.amazon.co.jp/s?k=%E7%BE%8E%E5%AE%B9%E6%B6%B2+%E3%83%97%E3%83%81%E3%83%97%E3%83%A9+%E3%82%BB%E3%83%83%E3%83%88&i=beauty", desc: "成分にこだわったコスパ重視のセット商品" },
  ],
};

// 肌タイプ別「今週試すべきTOP3」アイテム（A8.net高単価案件 + 具体商品名）
const TOP3_ITEMS: Record<string, { rank: number; name: string; brand: string; price: string; effect: string; url: string; tag: string }[]> = {
  "乾燥": [
    { rank: 1, name: "ケアセラ AP ゲルクリーム", brand: "花王", price: "¥1,800前後", effect: "セラミド配合でバリア機能を直接補修。乾燥肌に最もコスパが高い", url: "https://www.amazon.co.jp/s?k=%E3%82%B1%E3%82%A2%E3%82%BB%E3%83%A9+AP+%E3%82%B2%E3%83%AB&i=beauty", tag: "コスパ最強" },
    { rank: 2, name: "COSRX ヒアルロン酸 セラム", brand: "COSRX（韓国）", price: "¥2,500前後", effect: "低分子・高分子ヒアルロン酸W配合。深部と表面を同時に保水", url: "https://www.amazon.co.jp/s?k=COSRX+%E3%83%92%E3%82%A2%E3%83%AB%E3%83%AD%E3%83%B3%E9%85%B8+%E3%82%BB%E3%83%A9%E3%83%A0&i=beauty", tag: "K-beauty定番" },
    { rank: 3, name: "ミノン アミノモイスト", brand: "第一三共ヘルスケア", price: "¥2,200前後", effect: "アミノ酸系成分でやさしく保湿。皮膚科医からも推薦される低刺激設計", url: "https://www.amazon.co.jp/s?k=%E3%83%9F%E3%83%8E%E3%83%B3+%E3%82%A2%E3%83%9F%E3%83%8E%E3%83%A2%E3%82%A4%E3%82%B9%E3%83%88&i=beauty", tag: "皮膚科推薦" },
  ],
  "脂性": [
    { rank: 1, name: "COSRX AHA/BHA クラリファイングトナー", brand: "COSRX（韓国）", price: "¥1,500前後", effect: "サリチル酸0.1%で毛穴詰まりを週2回ずつ溶かす。オイリー肌の定番", url: "https://www.amazon.co.jp/s?k=COSRX+AHA+BHA+%E3%82%AF%E3%83%A9%E3%83%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%B3%E3%82%B0&i=beauty", tag: "毛穴対策" },
    { rank: 2, name: "The Ordinary ナイアシンアミド 10% + ジンク 1%", brand: "The Ordinary", price: "¥2,000前後", effect: "皮脂抑制・毛穴縮小の最強コンビ。1本で複数の悩みに対応", url: "https://www.amazon.co.jp/s?k=The+Ordinary+%E3%83%8A%E3%82%A4%E3%82%A2%E3%82%B7%E3%83%B3%E3%82%A2%E3%83%9F%E3%83%89+10%25&i=beauty", tag: "脂性肌最強" },
    { rank: 3, name: "ビオレ おうちdeエステ 肌をなめらかにするマッサージ洗顔ジェル", brand: "花王", price: "¥900前後", effect: "酵素洗顔でターンオーバーを促進。皮脂・毛穴詰まりをすっきり落とす", url: "https://www.amazon.co.jp/s?k=%E3%83%93%E3%82%AA%E3%83%AC+%E3%81%8A%E3%81%86%E3%81%A1%E3%81%A7%E3%82%A8%E3%82%B9%E3%83%86+%E3%83%9E%E3%83%83%E3%82%B5%E3%83%BC%E3%82%B8%E6%B4%97%E9%A1%94&i=beauty", tag: "プチプラ" },
  ],
  "混合": [
    { rank: 1, name: "hatomugi スキンコンディショナー（化粧水）", brand: "ナリス化粧品", price: "¥700前後", effect: "ハトムギエキス配合。大容量・低刺激でTゾーンとUゾーン両方に使える万能化粧水", url: "https://www.amazon.co.jp/s?k=%E3%83%8F%E3%83%88%E3%83%A0%E3%82%AE+%E3%82%B9%E3%82%AD%E3%83%B3%E3%82%B3%E3%83%B3%E3%83%87%E3%82%A3%E3%82%B7%E3%83%A7%E3%83%8A%E3%83%BC&i=beauty", tag: "コスパ神" },
    { rank: 2, name: "COSRX スネイルミューシン パワーエッセンス", brand: "COSRX（韓国）", price: "¥2,800前後", effect: "カタツムリムチン96.3%配合。乾燥しながらテカるUゾーンの水分・油分バランスを整える", url: "https://www.amazon.co.jp/s?k=COSRX+%E3%82%B9%E3%83%8D%E3%82%A4%E3%83%AB+%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%B7%E3%83%B3&i=beauty", tag: "K-beauty人気" },
    { rank: 3, name: "ニベア クリーム（缶）", brand: "花王", price: "¥500前後", effect: "Uゾーンの夜用保湿として少量使い。シアバター配合で油分フタ。コスパ最強", url: "https://www.amazon.co.jp/s?k=%E3%83%8B%E3%83%99%E3%82%A2+%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0+%E7%BC%B6&i=beauty", tag: "夜用保湿" },
  ],
  "敏感": [
    { rank: 1, name: "キュレル 潤浸保湿 化粧水（III しっとり）", brand: "花王", price: "¥2,000前後", effect: "セラミドケア成分でバリア機能を補修。皮膚科医が推薦する敏感肌の定番", url: "https://www.amazon.co.jp/s?k=%E3%82%AD%E3%83%A5%E3%83%AC%E3%83%AB+%E6%BD%A4%E6%B5%B8%E4%BF%9D%E6%B9%BF+%E5%8C%96%E7%B2%A7%E6%B0%B4&i=beauty", tag: "皮膚科推薦" },
    { rank: 2, name: "Dr.Jart+ シカペア クリーム", brand: "Dr.Jart+（韓国）", price: "¥3,500前後", effect: "シカ（ツボクサエキス）配合。炎症・赤みを鎮静させながら肌バリアを修復", url: "https://www.amazon.co.jp/s?k=Dr.Jart%2B+%E3%82%B7%E3%82%AB%E3%83%9A%E3%82%A2+%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0&i=beauty", tag: "赤み鎮静" },
    { rank: 3, name: "ヴァセリン オリジナルピュアスキンジェリー", brand: "ユニリーバ", price: "¥600前後", effect: "純度99.9%のワセリン。保護膜を作り刺激から肌を守る。敏感肌の最後の砦", url: "https://www.amazon.co.jp/s?k=%E3%83%B4%E3%82%A1%E3%82%BB%E3%83%AA%E3%83%B3+%E3%82%B9%E3%82%AD%E3%83%B3%E3%82%B8%E3%82%A7%E3%83%AA%E3%83%BC&i=beauty", tag: "最後の砦" },
  ],
  "default": [
    { rank: 1, name: "無印良品 敏感肌用 化粧水（高保湿タイプ）", brand: "良品計画", price: "¥1,490前後", effect: "無香料・無着色・無鉱物油。全肌タイプに使えるベーシックな高保湿化粧水", url: "https://www.amazon.co.jp/s?k=%E7%84%A1%E5%8D%B0%E8%89%AF%E5%93%81+%E6%95%8F%E6%84%9F%E8%82%8C+%E5%8C%96%E7%B2%A7%E6%B0%B4+%E9%AB%98%E4%BF%9D%E6%B9%BF&i=beauty", tag: "万能定番" },
    { rank: 2, name: "肌ラボ 極潤 ヒアルロン液", brand: "ロート製薬", price: "¥800前後", effect: "5種類のヒアルロン酸配合。化粧品ランキング常連の日本製高保湿化粧水", url: "https://www.amazon.co.jp/s?k=%E8%82%8C%E3%83%A9%E3%83%9C+%E6%A5%B5%E6%BD%A4+%E3%83%92%E3%82%A2%E3%83%AB%E3%83%AD%E3%83%B3%E6%B6%B2&i=beauty", tag: "日本製人気" },
    { rank: 3, name: "The Ordinary ヒアルロン酸 2% + B5", brand: "The Ordinary", price: "¥1,500前後", effect: "多分子ヒアルロン酸+パンテノール配合。肌タイプを問わず使えるコスパ最強美容液", url: "https://www.amazon.co.jp/s?k=The+Ordinary+%E3%83%92%E3%82%A2%E3%83%AB%E3%83%AD%E3%83%B3%E9%85%B8+2%25&i=beauty", tag: "コスパ最強" },
  ],
};

function getTop3Items(skinType: string) {
  if (skinType.includes("乾燥")) return TOP3_ITEMS["乾燥"];
  if (skinType.includes("脂性") || skinType.includes("オイリー")) return TOP3_ITEMS["脂性"];
  if (skinType.includes("混合")) return TOP3_ITEMS["混合"];
  if (skinType.includes("敏感")) return TOP3_ITEMS["敏感"];
  return TOP3_ITEMS["default"];
}

function Top3Section({ skinType }: { skinType: string }) {
  const items = getTop3Items(skinType);
  return (
    <div className="mt-4 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏆</span>
        <p className="text-sm font-bold text-rose-800">今週試すべきTOP3アイテム（{skinType}向け）</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <a
            key={item.rank}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-white border border-rose-100 rounded-xl p-3 hover:bg-rose-50 transition-colors group"
          >
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-sm ${item.rank === 1 ? "bg-amber-400 text-white" : item.rank === 2 ? "bg-gray-300 text-gray-700" : "bg-amber-700 text-white"}`}>
              {item.rank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <p className="text-xs font-bold text-gray-800 group-hover:text-rose-700">{item.name}</p>
                <span className="text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-medium">{item.tag}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{item.brand} · {item.price}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.effect}</p>
              <p className="text-xs text-rose-500 font-medium mt-1">Amazonで探す →</p>
            </div>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">※ Amazonアソシエイトリンクです。実際の商品は成分表示をご確認ください。</p>
    </div>
  );
}

function getAffiliateLinks(skinType: string) {
  if (skinType.includes("乾燥")) return AFFILIATE_LINKS["乾燥"];
  if (skinType.includes("脂性") || skinType.includes("オイリー")) return AFFILIATE_LINKS["脂性"];
  if (skinType.includes("混合")) return AFFILIATE_LINKS["混合"];
  if (skinType.includes("敏感")) return AFFILIATE_LINKS["敏感"];
  return AFFILIATE_LINKS["default"];
}

function AffiliateSection({ skinType }: { skinType: string }) {
  const links = getAffiliateLinks(skinType);
  return (
    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
      <p className="text-xs font-bold text-amber-700 mb-3">💛 あなたの肌タイプ（{skinType}）向けおすすめ商品</p>
      <div className="space-y-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white border border-amber-100 rounded-lg p-3 hover:bg-amber-50 transition-colors group"
          >
            <span className="text-xl shrink-0">🛒</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-800 group-hover:text-amber-900">{link.label} →</p>
              <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">※ Amazonアソシエイトリンクです。実際の商品は成分表示をご確認ください。</p>
    </div>
  );
}

function SkinTimeline({ skinScore }: { skinScore: number }) {
  const week2 = skinScore >= 80 ? "肌のキメが整い、化粧水の浸透が改善します" :
    skinScore >= 70 ? "乾燥・テカりのバランスが整い始めます" :
    "炎症が落ち着き、ニキビの新規発生が減少します";
  const month1 = skinScore >= 80 ? "くすみが改善し、透明感が増してきます" :
    skinScore >= 70 ? "毛穴が目立ちにくくなり、メイクのりが改善します" :
    "ニキビ跡が薄くなり、肌のざらつきが改善します";
  const month3 = "正しいケアを続けることで、肌の「素地」そのものが改善します";

  return (
    <div className="mt-3 bg-rose-50 border border-rose-100 rounded-xl p-4">
      <p className="text-xs font-bold text-rose-700 mb-3">📅 肌改善タイムライン（今日から始めた場合）</p>
      <div className="space-y-2">
        {[
          { period: "2週間後", content: week2, color: "bg-green-100 text-green-700" },
          { period: "1ヶ月後", content: month1, color: "bg-blue-100 text-blue-700" },
          { period: "3ヶ月後", content: month3, color: "bg-purple-100 text-purple-700" },
        ].map(({ period, content, color }) => (
          <div key={period} className="flex gap-2 items-start">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${color}`}>{period}</span>
            <p className="text-xs text-gray-600 leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const DIARY_KEY = "skincare_diary";
const STREAK_KEY = "skincare_streak";
const LAST_DATE_KEY = "skincare_last_date";
const HISTORY_KEY = "hada_score_history";

// 肌スコア履歴の型
type ScoreEntry = { date: string; score: number; skinType: string };

// 肌スコア履歴の保存
function saveScoreHistory(score: number, skinType: string) {
  try {
    const history: ScoreEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const today = new Date().toISOString().slice(0, 10);
    // 同日の重複を避けつつ最大10件保存
    const filtered = history.filter(h => h.date !== today);
    filtered.push({ date: today, score, skinType });
    if (filtered.length > 10) filtered.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch { /* ignore */ }
}

// 肌スコア推移グラフ
function SkinScoreHistory({ currentScore, skinType }: { currentScore: number; skinType: string }) {
  const [history, setHistory] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      setHistory(Array.isArray(raw) ? raw : []);
    } catch { setHistory([]); }
  }, [currentScore]);

  if (history.length < 2) {
    return (
      <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-4">
        <p className="text-xs font-bold text-rose-700 mb-1">📈 肌スコア推移グラフ</p>
        <p className="text-xs text-gray-500">2回以上診断すると推移グラフが表示されます。定期的に再診断してスコア変化を記録しましょう！</p>
      </div>
    );
  }

  const maxScore = Math.max(...history.map(h => h.score), 100);
  const minScore = Math.min(...history.map(h => h.score), 50);
  const range = maxScore - minScore || 10;
  const width = 280;
  const height = 80;
  const padX = 8;
  const padY = 8;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = history.map((h, i) => {
    const x = padX + (i / Math.max(history.length - 1, 1)) * chartW;
    const y = padY + chartH - ((h.score - minScore) / range) * chartH;
    return { x, y, ...h };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
  const latest = points[points.length - 1];
  const prev = points[points.length - 2];
  const diff = latest.score - prev.score;

  return (
    <div className="mt-4 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-rose-700">📈 肌スコア推移グラフ</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diff >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          {diff >= 0 ? "↑" : "↓"} {Math.abs(diff)}点
        </span>
      </div>
      <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={polyline}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={i === points.length - 1 ? "#f43f5e" : "#fda4af"} />
            <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="8" fill="#be185d" fontWeight="bold">{p.score}</text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {history.map((h, i) => (
          <span key={i} className="text-xs text-gray-400" style={{ fontSize: "9px" }}>{h.date.slice(5)}</span>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1">継続ケアでスコアアップを目指そう！ ({history.length}回記録)</p>
    </div>
  );
}

type DiaryState = { [item: string]: boolean };

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function SkincareDiary() {
  const morning = ["洗顔", "化粧水", "日焼け止め"];
  const night = ["クレンジング", "洗顔", "保湿クリーム"];
  const allItems = [...morning.map(i => `am_${i}`), ...night.map(i => `pm_${i}`)];

  const [checks, setChecks] = useState<DiaryState>({});
  const [streak, setStreak] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [prevComplete, setPrevComplete] = useState(false);

  useEffect(() => {
    const today = getTodayStr();
    const saved = localStorage.getItem(DIARY_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === today) {
        setChecks(data.checks || {});
      }
    }
    const savedStreak = parseInt(localStorage.getItem(STREAK_KEY) || "0");
    setStreak(savedStreak);
  }, []);

  const handleCheck = useCallback((key: string) => {
    const today = getTodayStr();
    setChecks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(DIARY_KEY, JSON.stringify({ date: today, checks: next }));

      const allDone = allItems.every(k => next[k]);
      if (allDone && !prevComplete) {
        const lastDate = localStorage.getItem(LAST_DATE_KEY);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        const savedStreak = parseInt(localStorage.getItem(STREAK_KEY) || "0");
        const newStreak = lastDate === yesterdayStr ? savedStreak + 1 : 1;
        localStorage.setItem(STREAK_KEY, String(newStreak));
        localStorage.setItem(LAST_DATE_KEY, today);
        setStreak(newStreak);
        setShowComplete(true);
        setPrevComplete(true);
        setTimeout(() => setShowComplete(false), 3500);
      }
      return next;
    });
  }, [allItems, prevComplete]);

  const doneCount = allItems.filter(k => checks[k]).length;
  const allDone = doneCount === allItems.length;

  return (
    <div className="mt-4 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-rose-800">📔 今日のスキンケア日記</p>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
            🔥 連続ケア {streak}日
          </span>
          <span className="text-xs text-gray-500">{doneCount}/{allItems.length}</span>
        </div>
      </div>

      {showComplete && (
        <div className="mb-3 bg-gradient-to-r from-rose-500 to-pink-400 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 shadow animate-bounce">
          <span className="text-lg">✨</span>
          <p className="text-sm font-bold">今日のスキンケア完了！✨</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-rose-100">
          <p className="text-xs font-bold text-amber-600 mb-2">☀️ 朝のケア</p>
          <div className="space-y-2">
            {morning.map(item => {
              const key = `am_${item}`;
              return (
                <label key={key} className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => handleCheck(key)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                      checks[key] ? "bg-rose-500 border-rose-500" : "border-gray-300 group-hover:border-rose-300"
                    }`}
                  >
                    {checks[key] && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-xs transition-colors ${checks[key] ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-rose-100">
          <p className="text-xs font-bold text-indigo-600 mb-2">🌙 夜のケア</p>
          <div className="space-y-2">
            {night.map(item => {
              const key = `pm_${item}`;
              return (
                <label key={key} className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => handleCheck(key)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                      checks[key] ? "bg-rose-500 border-rose-500" : "border-gray-300 group-hover:border-rose-300"
                    }`}
                  >
                    {checks[key] && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-xs transition-colors ${checks[key] ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {allDone && (
        <div className="mt-3 text-center">
          <span className="text-xs bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full">
            本日のケア達成！{streak}日連続継続中 🏆
          </span>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">毎日ケアを続けてストリークを伸ばしましょう</p>
    </div>
  );
}

function ResultTabs({ parsed, skinType, concerns, lifestyle }: {
  parsed: ParsedResult;
  skinType: string;
  concerns: string;
  lifestyle: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const section = parsed.sections[activeTab];

  const skinSection = parsed.sections.find(s => s.title.includes("肌") || s.title.includes("診断"));
  const rawContent = skinSection?.content ?? "肌診断結果";
  const firstLine = rawContent.split('\n')[0] ?? "肌診断結果";

  // 動的スコア算出: 肌タイプ・悩みの数・ライフスタイルから計算
  const concernCount = concerns.split(/[、,\n]/).filter(c => c.trim().length > 0).length;
  const baseScore = skinType.includes("普通") ? 82 : skinType.includes("乾燥") ? 71 : skinType.includes("脂性") ? 68 : skinType.includes("混合") ? 75 : 74;
  const lifestyleBonus = lifestyle.includes("毎日") ? 3 : lifestyle.includes("少ない") ? -4 : 0;
  const skinScore = Math.min(95, Math.max(55, baseScore - concernCount * 3 + lifestyleBonus));

  const ogUrl = `https://hada-ai.vercel.app/api/og?score=${skinScore}&skinType=${encodeURIComponent(skinType)}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`AI美肌診断を受けてみた💄\n私の肌スコア: ${skinScore}点/100点（${skinType}）\n有効成分・NGリスト・ルーティンまで全部教えてもらえた✨\n#AI美肌診断 #スキンケア #美容`)}&url=${encodeURIComponent(ogUrl)}`;

  const scoreColor = skinScore >= 80 ? "from-emerald-400 to-teal-400" : skinScore >= 70 ? "from-yellow-400 to-orange-300" : "from-rose-400 to-pink-400";
  const scoreLabel = skinScore >= 80 ? "美肌レベル：優秀✨" : skinScore >= 70 ? "美肌レベル：良好" : "美肌レベル：要ケア";

  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (skinScore / 100) * circ;

  // スコアを履歴に保存
  useEffect(() => {
    saveScoreHistory(skinScore, skinType);
  }, [skinScore, skinType]);

  return (
    <div className="flex flex-col gap-3">
      {/* 肌スコアヒーローカード（結果最上部に大きく表示） */}
      <div className={`bg-gradient-to-br ${scoreColor} rounded-2xl p-5 text-white shadow-lg`}>
        <p className="text-xs opacity-80 mb-3 text-center font-semibold tracking-wide">AI美肌診断スコア</p>
        <div className="flex items-center gap-5">
          <div className="shrink-0">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="10" />
              <circle
                cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="10"
                strokeDasharray={circ} strokeDashoffset={offset}
                transform="rotate(-90 50 50)" strokeLinecap="round"
              />
              <text x="50" y="46" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">{skinScore}</text>
              <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9">/100点</text>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-base font-bold mb-1">{scoreLabel}</p>
            <p className="text-xs opacity-90 leading-relaxed">{firstLine || skinType}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {["肌診断 ✓", "ルーティン ✓", "成分解析 ✓"].map(tag => (
                <span key={tag} className="text-xs bg-white/20 rounded-full px-2 py-0.5">{tag}</span>
              ))}
            </div>
            <p className="text-xs mt-2 opacity-60">hada-ai.vercel.app</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {parsed.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{s.icon}</span><span>{s.title}</span>
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[360px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{section.icon} {section.title}</span>
          <CopyButton text={section.content} />
        </div>
        <div className="space-y-2">
          {section.content.split('\n').map((line, i) => {
            if (line.startsWith('## ') || line.startsWith('# ')) {
              return (
                <h3 key={i} className="text-sm font-black pt-2 pb-1 border-b border-rose-200 text-rose-700">
                  {line.replace(/^#{1,3}\s/, '')}
                </h3>
              );
            }
            if (line.startsWith('✓') || line.match(/^[・•]\s/) || line.match(/^[-]\s/) || line.match(/^\d+\.\s/)) {
              const isCheck = line.startsWith('✓');
              return (
                <div key={i} className="flex gap-2 items-start text-sm text-gray-700">
                  <span className="flex-shrink-0 mt-0.5 text-rose-500 font-bold">{isCheck ? '✓' : '●'}</span>
                  <span>{line.replace(/^[✓・•\-]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
                </div>
              );
            }
            if (line.trim() === '') return <div key={i} className="h-1" />;
            if (line.startsWith('【') || line.startsWith('■') || line.startsWith('▶')) {
              return (
                <p key={i} className="text-sm font-semibold text-gray-800 mt-2">{line}</p>
              );
            }
            return (
              <p key={i} className="text-sm leading-relaxed text-gray-700">{line}</p>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2 justify-end flex-wrap">
        <CopyButton text={parsed.raw} label="全文コピー" />
      </div>

      {/* 肌改善タイムライン（診断タブ表示時） */}
      {activeTab === 0 && <SkinTimeline skinScore={skinScore} />}

      {/* 今週試すべきTOP3アイテム（商品レコメンドタブ表示時） */}
      {section.title.includes("商品") && <Top3Section skinType={skinType} />}

      {/* アフィリエイト導線（商品レコメンドタブ表示時） */}
      {section.title.includes("商品") && <AffiliateSection skinType={skinType} />}

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => window.open(tweetUrl, '_blank')}
          className="flex-1 bg-rose-500 hover:bg-rose-400 text-white font-bold px-4 py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.892-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          X でシェア
        </button>
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://hada-ai.vercel.app`)}&text=${encodeURIComponent(`AI美肌診断で肌スコア${skinScore}点でした💄（${skinType}）\n有効成分・NGリスト・ケアルーティンまで全部教えてもらえた✨\n#AI美肌診断 #スキンケア`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          LINE
        </a>
      </div>
      {/* A8.netアフィリエイト：美容・ダイエット */}
      <div className="mt-4 bg-pink-950 border border-pink-800 rounded-xl p-4">
        <p className="text-xs font-bold text-pink-200 mb-3">✨ 美肌をさらに磨くために（PR）</p>
        <div className="space-y-2">
          {[
            { icon: "🏃", label: "ハビットパーソナルジム", desc: "失敗したら全額返金！2ヶ月ダイエットコース", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+5TKLPU+56HC+5YJRM" },
            { icon: "💪", label: "ビーコンセプト", desc: "女性向け下半身痩せ専門パーソナルジム", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+5X57CI+3UK2+5YRHE" },
            { icon: "🧬", label: "CLOUD GYM", desc: "遺伝子検査×オンラインパーソナルトレーニング", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+5VCWJ6+4RUO+5YJRM" },
            { icon: "🌸", label: "Dione 全身脱毛", desc: "敏感肌専門の脱毛サロン。全身脱毛体験受付中", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+4V1GMQ+3W7I+HVV0H" },
            { icon: "💎", label: "韓国美顔器 Dr.tengle", desc: "メイクさん愛用の韓国スキンケア美顔器", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+4W8BUA+4GDM+TS3OI" },
            { icon: "🧘", label: "SOELU オンラインヨガ", desc: "本格ヨガ・フィットネスを自宅で。トライアル1,000円", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9" },
          ].map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-3 bg-pink-900 hover:bg-pink-800 border border-pink-700 rounded-lg p-3 transition-colors group">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-pink-100 group-hover:text-white">{item.label} →</p>
                <p className="text-xs text-pink-300 mt-0.5">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 次のアクション3選 */}
      <div className="mt-4 bg-pink-50 border border-pink-200 rounded-xl p-4">
        <p className="text-sm font-bold text-pink-800 mb-3">💄 次にやるべきこと3選</p>
        <ol className="space-y-2">
          {[
            { icon: "🛍️", text: "「おすすめ成分・NG成分」タブを見て次に買う化粧品を選ぶ" },
            { icon: "📋", text: "「スキンケアルーティン」タブをコピーして毎朝のルーティン表を作る" },
            { icon: "🌿", text: "2週間後に同じ診断をして肌スコアの変化を計測する" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{i + 1}. {item.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* スキンケア日記 */}
      <SkincareDiary />

      {/* 肌スコア推移グラフ */}
      <SkinScoreHistory currentScore={skinScore} skinType={skinType} />

      {/* 肌年齢診断 */}
      <div className="mt-4 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4">
        <p className="text-sm font-bold text-pink-800 mb-2">🎂 あなたの推定肌年齢</p>
        <div className="flex items-center gap-4">
          <div className="shrink-0 text-center">
            <div className="text-4xl font-black text-rose-600">
              {skinScore >= 85 ? "-5" : skinScore >= 75 ? "-2" : skinScore >= 65 ? "±0" : skinScore >= 55 ? "+3" : "+5"}
            </div>
            <div className="text-xs text-gray-500">歳（実年齢比）</div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 leading-relaxed">
              {skinScore >= 85
                ? "肌状態が非常に良好です。適切なケアを続けることで実年齢より若く見える肌を維持できています。"
                : skinScore >= 75
                ? "肌状態は良好です。保湿・紫外線対策を継続することで肌年齢の改善が期待できます。"
                : skinScore >= 65
                ? "肌状態は平均的です。成分を意識したスキンケアで実年齢相応の美肌を目指しましょう。"
                : "肌ケアを見直すチャンスです。ルーティンタブのアドバイスを参考に改善を始めましょう。"}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 肌年齢はAIによる推定参考値です。医療的診断ではありません。</p>
      </div>
    </div>
  );
}

export default function HadaTool() {
  const [skinType, setSkinType] = useState("混合肌");
  const [concerns, setConcerns] = useState("");
  const [routine, setRoutine] = useState("");
  const [lifestyle, setLifestyle] = useState("普通（週3〜4回洗顔）");
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [completionVisible, setCompletionVisible] = useState(false);

  useEffect(() => {
    setCount(parseInt(localStorage.getItem(KEY) || "0"));
    fetch("/api/auth/status").then(r => r.json()).then(d => setIsPremium(d.premium));
  }, []);

  const isLimit = !isPremium && count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { track('paywall_shown', { service: 'AI美肌診断' }); setShowPaywall(true); return; }
    track('ai_generated', { service: 'AI美肌診断' });
    setLoading(true); setParsed(null); setError(""); setCompletionVisible(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skinType, concerns, routine, lifestyle }),
      });
      if (res.status === 429) { track('paywall_shown', { service: 'AI美肌診断' }); setShowPaywall(true); setLoading(false); return; }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "エラーが発生しました"); setLoading(false); return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk.includes("\nDONE:")) {
          const idx = chunk.indexOf("\nDONE:");
          accumulated += chunk.slice(0, idx);
          try {
            const meta = JSON.parse(chunk.slice(idx + 6));
            const newCount = meta.count ?? count + 1;
            localStorage.setItem(KEY, String(newCount));
            setCount(newCount);
            if (!isPremium && newCount >= FREE_LIMIT) setTimeout(() => { track('paywall_shown', { service: 'AI美肌診断' }); setShowPaywall(true); }, 1500);
          } catch { /* ignore */ }
        } else {
          accumulated += chunk;
        }
        setParsed(parseResult(accumulated));
      }
      // 達成感バナー表示
      setCompletionVisible(true);
      setTimeout(() => setCompletionVisible(false), 4000);
    } catch { setError("通信エラーが発生しました。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">✨</div>
            <h2 className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">AI美肌診断 無制限（いつでもキャンセル可）</p>
            <KomojuButton planId="standard" planLabel="AI美肌診断 プレミアム ¥1,980/月" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">💄 AI美肌診断</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isPremium ? "bg-rose-100 text-rose-600" : isLimit ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {isPremium ? "プレミアム" : isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">あなたの肌情報を入力</h1>
            <p className="text-sm text-gray-500 mt-1">詳しく入力するほど、精度の高い診断が得られます。</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">肌タイプ</label>
            <select value={skinType} onChange={e => setSkinType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
              {["乾燥肌", "混合肌", "脂性肌（オイリー）", "敏感肌", "普通肌", "よく分からない"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              肌の悩み <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                { emoji: "🕳️", label: "毛穴・黒ずみ", text: "毛穴が目立つ（特にTゾーン）\n黒ずみ・白ずみが気になる" },
                { emoji: "💧", label: "乾燥・かさつき", text: "乾燥によるかさつき・ひきつれ\n化粧水が浸透しにくい" },
                { emoji: "🔴", label: "ニキビ・吹き出物", text: "繰り返すニキビ・吹き出物\nニキビ跡が残りやすい" },
                { emoji: "✨", label: "くすみ・透明感", text: "くすみが気になる\n透明感・ハリが欲しい" },
                { emoji: "☀️", label: "シミ・色素沈着", text: "シミ・そばかす・色素沈着\n紫外線ダメージが蓄積してきた" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setConcerns(prev => prev ? prev + "\n" + p.text : p.text)}
                  className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full transition font-medium"
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
            <textarea value={concerns} onChange={e => setConcerns(e.target.value)} rows={4} required
              placeholder={"例:\n・毛穴が目立つ（特にTゾーン）\n・乾燥による小ジワが気になる\n・ニキビ跡が残りやすい\n・くすみ・透明感が欲しい"}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">具体的に書くほど精度UP（{concerns.length}文字）</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在のスキンケア</label>
            <textarea value={routine} onChange={e => setRoutine(e.target.value)} rows={3}
              placeholder={"例:\n・洗顔料: ○○（泡立てて使用）\n・化粧水: △△\n・乳液: 使っていない\n・日焼け止め: SPF50を使用"}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ライフスタイル</label>
            <select value={lifestyle} onChange={e => setLifestyle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
              {["インドア中心（紫外線少なめ）", "普通（週3〜4回洗顔）", "運動多め・汗をよくかく", "マスク長時間着用", "睡眠不足気味・ストレス多め"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading || !concerns.trim()}
            className={`w-full font-bold py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300"}`}>
            {loading ? "診断中..." : isLimit ? "プレミアムで無制限に診断" : "肌を診断する（無料）"}
          </button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700 mb-2">診断結果</label>

          {/* 達成感バナー */}
          <div className={`transition-all duration-500 overflow-hidden ${completionVisible ? "max-h-24 opacity-100 mb-3" : "max-h-0 opacity-0"}`}>
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-bold text-sm">肌診断 完了！</p>
                <p className="text-xs opacity-80">あなたの美肌スコアをチェックしてください</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[420px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">AIが肌を分析しています...</p>
                <p className="text-xs text-gray-400 mt-2">🔬 肌診断 → 📋 ルーティン → 🧪 成分解析</p>
              </div>
            </div>
          ) : parsed ? (
            <ResultTabs parsed={parsed} skinType={skinType} concerns={concerns} lifestyle={lifestyle} />
          ) : (
            <>
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[420px] gap-3">
                <div className="text-4xl">💄</div>
                <p className="text-sm text-center font-medium text-gray-500">肌の情報を入力して<br />「肌を診断する」を押してください</p>
                <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                  <p className="font-semibold text-gray-600">診断でわかること：</p>
                  <p className="text-gray-500">🔬 あなたの肌タイプ詳細分析</p>
                  <p className="text-gray-500">📋 朝・夜のスキンケアルーティン</p>
                  <p className="text-gray-500">🧪 注目すべき成分と避ける成分</p>
                  <p className="text-gray-500">🛒 コスパ重視の商品レコメンド</p>
                </div>
              </div>
              <SkincareDiary />
            </>
          )}
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-gray-400 border-t mt-4 space-x-4">
        <a href="/legal" className="hover:text-gray-600">特定商取引法に基づく表記</a>
        <span>·</span>
        <a href="/privacy" className="hover:text-gray-600">プライバシーポリシー</a>
      </footer>
    </main>
  );
}
