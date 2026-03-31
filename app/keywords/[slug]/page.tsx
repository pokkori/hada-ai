import type { Metadata } from "next";
import Link from "next/link";

interface KeywordData {
  title: string;
  h1: string;
  description: string;
  features: { icon: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
  lastUpdated: string;
}

export const KEYWORDS: Record<string, KeywordData> = {
  "hada-type-diagnosis-ai": {
    title: "肌タイプ 診断 AI 無料 | AI美肌診断",
    h1: "肌タイプ 診断 AI 無料",
    description: "AIが肌タイプを無料で診断。乾燥肌・脂性肌・混合肌・敏感肌を判定して最適なスキンケアを提案します。",
    features: [
      { icon: "🔬", title: "AI肌タイプ判定", text: "肌の状態・悩みを入力するだけでAIが肌タイプを判定して最適ケアを提案" },
      { icon: "💊", title: "成分レコメンド", text: "肌タイプに合った美容成分・化粧品の選び方をAIが具体的に提案" },
      { icon: "📋", title: "ケアルーティン作成", text: "朝・夜のスキンケアルーティンをAIが個別に設計" },
    ],
    faqs: [
      { q: "肌タイプ診断は何を判断する？", a: "皮脂量・水分量・キメ・毛穴・敏感度の5項目から乾燥肌・脂性肌・混合肌・普通肌・敏感肌を判定します。" },
      { q: "肌タイプは変わることがある？", a: "季節・年齢・ライフスタイルで変化します。AIが現在の状態に合ったケアを随時提案します。" },
      { q: "診断結果に基づいてどんなアドバイスがもらえる？", a: "洗顔方法・保湿ケア・日焼け止め選び・食事・生活習慣まで総合的なアドバイスをAIが提供します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "kanso-hada-care-method": {
    title: "乾燥肌 ケア 方法 おすすめ | AI美肌診断",
    h1: "乾燥肌 ケア 方法 おすすめ",
    description: "乾燥肌のケア方法をAIが提案。保湿の正しい手順・おすすめ成分・生活習慣の改善まで総合的にサポートします。",
    features: [
      { icon: "💧", title: "保湿ケア最適化", text: "乾燥肌に効果的な保湿成分・製品の選び方と使用順序をAIが提案" },
      { icon: "🌿", title: "成分分析", text: "ヒアルロン酸・セラミド・コラーゲンなど乾燥肌向け成分の効果をAIが解説" },
      { icon: "🏠", title: "生活習慣アドバイス", text: "水分摂取・湿度管理・食事など乾燥肌改善の生活習慣をAIが提案" },
    ],
    faqs: [
      { q: "乾燥肌の正しい保湿手順は？", a: "洗顔後すぐに化粧水→乳液→クリームの順で重ねるのが基本です。AIが肌状態に合った最適な手順を提案します。" },
      { q: "乾燥肌に避けるべき成分は？", a: "アルコール・強い界面活性剤・香料などは乾燥肌を悪化させることがあります。AIが成分チェックをサポートします。" },
      { q: "乾燥肌は治る？", a: "正しいケアと生活習慣の改善で大幅に改善できます。AIが継続的な改善プランを提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "acne-prone-skin-care": {
    title: "ニキビ肌 スキンケア AI 改善 | AI美肌診断",
    h1: "ニキビ肌 スキンケア AI 改善",
    description: "ニキビ肌のスキンケア方法をAIが分析。ニキビの原因特定から改善ケア・再発防止までAIが総合サポートします。",
    features: [
      { icon: "🔍", title: "ニキビ原因分析", text: "皮脂過多・毛穴詰まり・ホルモン・ストレスなどニキビの原因をAIが特定" },
      { icon: "🧴", title: "ノンコメドジェニックケア", text: "毛穴を詰まらせない成分・製品の選び方をAIが提案" },
      { icon: "📊", title: "改善プログラム", text: "ニキビの種類（白ニキビ・赤ニキビ・黒ニキビ）別の改善ケアをAIが設計" },
    ],
    faqs: [
      { q: "ニキビ肌のスキンケアで注意することは？", a: "過剰な洗顔・油分の多いクリーム・刺激の強い成分を避け、ニキビ肌向けのノンコメドジェニック製品を選ぶことが重要です。" },
      { q: "大人ニキビと思春期ニキビの違いは？", a: "原因と出来る場所が異なります。大人ニキビはあごや頬に出やすく、ホルモン・ストレス・乾燥が主な原因です。AIが種類別のケアを提案します。" },
      { q: "ニキビ跡のケアは？", a: "赤み・色素沈着・クレーターなど種類によってケア方法が異なります。AIがニキビ跡の種類別改善方法を提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "sensitive-skin-daily-care": {
    title: "敏感肌 日常 ケア 方法 | AI美肌診断",
    h1: "敏感肌 日常 ケア 方法",
    description: "敏感肌の日常ケア方法をAIが提案。刺激を最小限に抑えた優しいスキンケアルーティンをAIが設計します。",
    features: [
      { icon: "🌸", title: "低刺激ケア設計", text: "敏感肌向けの無香料・無着色・低刺激成分を使ったルーティンをAIが設計" },
      { icon: "⚠️", title: "刺激成分チェック", text: "化粧品の成分表示から敏感肌に避けるべき成分をAIが自動チェック" },
      { icon: "🛡️", title: "バリア機能強化", text: "敏感肌の根本原因であるバリア機能低下を改善するケアをAIが提案" },
    ],
    faqs: [
      { q: "敏感肌に使っていい成分は？", a: "セラミド・ヒアルロン酸・アラントイン・グリセリンなどが敏感肌に優しい成分です。AIが成分チェックをサポートします。" },
      { q: "敏感肌の洗顔方法は？", a: "泡立てた洗顔料で優しく洗い、ぬるま湯でしっかりすすぐのが基本です。AIが肌状態に合った洗顔方法を提案します。" },
      { q: "新しい化粧品を試す際の注意点は？", a: "パッチテストを必ず行い、1種類ずつ試すことが重要です。AIが新製品導入の手順をガイドします。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "hada-barrier-repair": {
    title: "肌 バリア機能 回復 方法 | AI美肌診断",
    h1: "肌 バリア機能 回復 方法",
    description: "肌のバリア機能を回復させる方法をAIが解説。正しいスキンケアと生活習慣でバリア機能を強化する方法をサポートします。",
    features: [
      { icon: "🛡️", title: "バリア機能診断", text: "バリア機能低下のサインをAIが診断。原因特定と回復プランを提案" },
      { icon: "💊", title: "セラミドケア", text: "バリア機能の主成分セラミドを効果的に補う製品・成分選びをAIが提案" },
      { icon: "🌱", title: "生活習慣改善", text: "睡眠・食事・ストレス管理などバリア機能に影響する生活習慣をAIが分析" },
    ],
    faqs: [
      { q: "バリア機能が低下するとどうなる？", a: "乾燥・ニキビ・かゆみ・赤みなど様々な肌トラブルが起きやすくなります。AIが症状からバリア機能の状態を診断します。" },
      { q: "バリア機能を回復させるには？", a: "過剰な洗顔を避け、セラミド配合の保湿剤で丁寧にケアすることが基本です。AIが回復プログラムを設計します。" },
      { q: "バリア機能回復にはどれくらいかかる？", a: "軽症なら2〜4週間、重症なら数ヶ月かかることもあります。AIが段階的な回復プランを提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "summer-skin-care-routine": {
    title: "夏 肌ケア ルーティン UV対策 | AI美肌診断",
    h1: "夏 肌ケア ルーティン UV対策",
    description: "夏の肌ケアルーティンとUV対策をAIが提案。紫外線・汗・皮脂による肌ダメージを防ぐケア方法をサポートします。",
    features: [
      { icon: "☀️", title: "UV対策最適化", text: "肌タイプ・ライフスタイルに合った日焼け止めの選び方と塗り直し方をAIが提案" },
      { icon: "🌊", title: "夏のべたつきケア", text: "汗・皮脂による毛穴詰まりを防ぐ洗顔・保湿バランスをAIが最適化" },
      { icon: "🍉", title: "美白ケア", text: "夏の色素沈着・シミ予防のための美白成分と使い方をAIが提案" },
    ],
    faqs: [
      { q: "夏のスキンケアで特に重要なことは？", a: "日焼け止めの毎日使用・こまめな塗り直し・UV後のアフターケアが最重要です。AIが夏専用ルーティンを設計します。" },
      { q: "SPFはどれくらい必要？", a: "日常使いはSPF30、アウトドアはSPF50+が目安です。AIがライフスタイルに合ったSPFを提案します。" },
      { q: "夏は保湿しなくていい？", a: "冷房による乾燥があるため保湿は必要です。ただし軽いテクスチャーのものを選ぶことをAIが提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "winter-dry-skin-care": {
    title: "冬 乾燥 肌荒れ 対策 スキンケア | AI美肌診断",
    h1: "冬 乾燥 肌荒れ 対策 スキンケア",
    description: "冬の乾燥・肌荒れ対策スキンケアをAIが提案。気温・湿度低下による肌ダメージを防ぐケア方法を設計します。",
    features: [
      { icon: "❄️", title: "冬用ルーティン設計", text: "低温・低湿度環境での肌乾燥を防ぐ冬専用スキンケアをAIが設計" },
      { icon: "🔥", title: "集中保湿ケア", text: "冬に特に必要な集中保湿の方法とおすすめ成分をAIが提案" },
      { icon: "🏠", title: "環境対策アドバイス", text: "室内の加湿・暖房の使い方など肌に優しい環境づくりをAIがアドバイス" },
    ],
    faqs: [
      { q: "冬に肌が荒れるのはなぜ？", a: "気温・湿度の低下により皮脂分泌が減り、水分が蒸発しやすくなるためです。AIが原因別の対策を提案します。" },
      { q: "冬のスキンケアで変えるべきことは？", a: "保湿力の高い製品への切り替え・化粧水の量を増やす・週1〜2回の集中保湿マスクなどをAIが提案します。" },
      { q: "冬に唇やかかとが荒れる場合は？", a: "顔以外のパーツケアも重要です。AIが全身の乾燥対策を総合的にアドバイスします。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "beauty-ingredient-analysis": {
    title: "美容成分 分析 肌 効果 AI | AI美肌診断",
    h1: "美容成分 分析 肌 効果 AI",
    description: "美容成分をAIが分析。化粧品の成分表示から肌への効果・リスク・おすすめの使い方をAIが解説します。",
    features: [
      { icon: "🧪", title: "成分分析AI", text: "化粧品の全成分をAIが分析。効果・肌タイプ適性・注意すべき成分を可視化" },
      { icon: "📊", title: "成分効果データベース", text: "主要美容成分（ビタミンC・レチノール・ナイアシンアミドなど）の効果をAIが解説" },
      { icon: "⚠️", title: "成分相性チェック", text: "組み合わせるべきでない成分・相乗効果のある成分をAIが判定" },
    ],
    faqs: [
      { q: "化粧品の成分表示の見方は？", a: "成分は配合量の多い順に表示されています。AIが成分表示を解析して肌への影響を分かりやすく説明します。" },
      { q: "レチノールとビタミンCは一緒に使える？", a: "刺激が強くなる可能性があるため、朝夜に分けて使うことを推奨します。AIが成分の組み合わせ方をアドバイスします。" },
      { q: "「無添加」は本当に肌に優しい？", a: "「無添加」の定義は曖昧で全ての添加物を除いているわけではありません。AIが成分表示から実際の安全性を評価します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "skin-age-improvement": {
    title: "肌年齢 改善 若返り ケア方法 | AI美肌診断",
    h1: "肌年齢 改善 若返り ケア方法",
    description: "肌年齢を改善する若返りケア方法をAIが提案。エイジングケアの正しい知識と実践方法をAIがサポートします。",
    features: [
      { icon: "🌟", title: "肌年齢診断", text: "肌の状態（ハリ・ツヤ・シミ・シワ）から肌年齢をAIが推定してケアを提案" },
      { icon: "⏰", title: "エイジングケア設計", text: "年齢・肌状態に合ったエイジングケアルーティンをAIが設計" },
      { icon: "💡", title: "最新成分提案", text: "レチノール・EGF・ペプチドなど最新エイジングケア成分の使い方をAIが解説" },
    ],
    faqs: [
      { q: "エイジングケアはいつから始めるべき？", a: "予防的なエイジングケアは20代後半から始めるのが理想です。AIが年齢・肌状態に合ったスタートプランを提案します。" },
      { q: "肌年齢を若返らせるために最も効果的なことは？", a: "日焼け止めによるUV予防が最も効果的です。次いで保湿・睡眠・食事が重要です。AIが優先順位付きのプランを提案します。" },
      { q: "シミ・シワはケアで改善できる？", a: "軽度〜中度のシミ・シワは適切なケアで改善可能です。AIが状態に合ったケア方法と期待できる効果を説明します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "hada-trouble-diagnosis": {
    title: "肌トラブル 原因 診断 解決策 | AI美肌診断",
    h1: "肌トラブル 原因 診断 解決策",
    description: "肌トラブルの原因をAIが診断。赤み・かゆみ・ニキビ・乾燥など様々な肌トラブルの原因と解決策をAIが提案します。",
    features: [
      { icon: "🔍", title: "トラブル原因特定", text: "症状・発生部位・生活習慣から肌トラブルの原因をAIが特定して解決策を提案" },
      { icon: "📋", title: "改善プロトコル", text: "肌トラブルの種類・重症度別の改善ケアプロトコルをAIが設計" },
      { icon: "🏥", title: "受診判断サポート", text: "自己ケアで対応可能か皮膚科受診が必要かをAIが判断基準を提示" },
    ],
    faqs: [
      { q: "肌が突然赤くなった場合は？", a: "接触アレルギー・摩擦・新製品の刺激などが原因として考えられます。AIが症状から原因を絞り込んで対処法を提案します。" },
      { q: "顔がかゆい原因は？", a: "乾燥・アレルギー・化粧品の刺激・花粉など様々な原因があります。AIが症状パターンから原因を特定します。" },
      { q: "スキンケアを変えたら肌荒れした場合は？", a: "新製品の成分に肌が反応している可能性があります。AIが成分分析を行い、刺激の原因を特定します。" },
    ],
    lastUpdated: "2026-03-31",
  },
};

const ALL_SLUGS = Object.keys(KEYWORDS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = KEYWORDS[slug];
  if (!data) return { title: "Not Found" };
  return {
    title: data.title,
    description: data.description,
    openGraph: { title: data.title, description: data.description, type: "article", modifiedTime: data.lastUpdated, url: `https://hada-ai.vercel.app/keywords/${slug}` },
    twitter: { card: "summary_large_image", title: data.title, description: data.description },
    alternates: { canonical: `https://hada-ai.vercel.app/keywords/${slug}` },
    other: { "article:modified_time": data.lastUpdated },
  };
}

export default async function KeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = KEYWORDS[slug];
  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1>ページが見つかりません</h1>
          <Link href="/" style={{ color: "#ec4899" }}>トップへ戻る</Link>
        </div>
      </div>
    );
  }
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage", "dateModified": data.lastUpdated,
    "mainEntity": data.faqs.map((faq) => ({ "@type": "Question", "name": faq.q, "acceptedAnswer": { "@type": "Answer", "text": faq.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #4a044e 50%, #0f172a 100%)", color: "#e2e8f0", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: "bold", marginBottom: "1rem", background: "linear-gradient(90deg, #ec4899, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{data.h1}</h1>
            <p style={{ fontSize: "1.1rem", color: "#94a3b8", marginBottom: "2rem" }}>{data.description}</p>
            <Link href="/" style={{ display: "inline-block", background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "#fff", padding: "1rem 2.5rem", borderRadius: "50px", fontWeight: "bold", fontSize: "1.1rem", textDecoration: "none" }}>今すぐ無料で肌診断 →</Link>
          </div>
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center", color: "#ec4899" }}>AIがサポートする3つのポイント</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {data.features.map((f, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: "12px", padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "2rem" }}>{f.icon}</span>
                  <div><h3 style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "#ec4899" }}>{f.title}</h3><p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{f.text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center", color: "#ec4899" }}>よくある質問</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {data.faqs.map((faq, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
                  <h3 style={{ fontWeight: "bold", marginBottom: "0.75rem", color: "#ec4899", fontSize: "1rem" }}>Q: {faq.q}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: "3rem", padding: "2rem", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "16px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#ec4899" }}>AIがあなたの肌を診断</h2>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>肌の悩みを入力するだけで最適なケアプランをAIが提案</p>
            <Link href="/" style={{ display: "inline-block", background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "#fff", padding: "1rem 2.5rem", borderRadius: "50px", fontWeight: "bold", textDecoration: "none" }}>無料で診断してみる →</Link>
          </div>
          <p style={{ textAlign: "center", color: "#475569", fontSize: "0.8rem", marginBottom: "2rem" }}>最終更新: {data.lastUpdated}</p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
            <h3 style={{ textAlign: "center", color: "#94a3b8", marginBottom: "1rem" }}>他のAIツールも試してみる</h3>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="https://konkatsu-ai.vercel.app" style={{ color: "#ec4899", textDecoration: "none", fontSize: "0.9rem" }}>婚活AI</Link>
              <Link href="https://myakuari-ai.vercel.app" style={{ color: "#ec4899", textDecoration: "none", fontSize: "0.9rem" }}>脈あり解読AI</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
