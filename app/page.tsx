"use client";
import { useState } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

const SKIN_SAMPLES = [
  {
    type: "🌿 乾燥×敏感肌",
    profile: "28歳女性・乾燥が強く少し赤みが出やすい・韓国コスメに興味あり",
    tabs: [
      {
        label: "🔬 肌タイプ",
        content: `【診断結果】乾燥敏感肌（Dry-Sensitive）タイプ

━━ あなたの肌の状態 ━━
水分量：やや不足（バリア機能が低下気味）
皮脂量：少なめ
敏感度：高め（紫外線・乾燥・摩擦で反応しやすい）
毛穴：目立ちにくいが乾燥による小じわが出やすい

━━ このタイプの特徴 ━━
・朝起きた時に肌がつっぱる
・季節の変わり目に赤みや痒みが出やすい
・洗顔後すぐに保湿しないと粉を吹く
・刺激の強い商品でかぶれた経験がある`,
      },
      {
        label: "📋 ルーティン",
        content: `【朝のスキンケア（推奨手順）】

① 洗顔（ぬるま湯か超低刺激フォーム）
   → 熱いお湯は皮脂を奪いすぎるので必ず38℃以下

② ブースター（導入美容液）— オプション
   → セラミドまたはヒアルロン酸配合の高浸透タイプ

③ 保湿化粧水（たっぷり2〜3回重ねづけ）
   → セラミド・ナイアシンアミド配合を優先選択

④ 乳液またはクリーム
   → シアバター・スクワランで油分フタをする

⑤ UVケア（SPF30以上）
   → 敏感肌用・ノンコメドジェニックを選ぶ

【夜のスキンケア】
① クレンジング（ミルク or バーム）
② 洗顔
③ 美容液（ナイアシンアミド・レチノールは低濃度から）
④ 保湿クリーム（夜は朝の1.5倍の量で）`,
      },
      {
        label: "🧪 注目成分",
        content: `【乾燥敏感肌タイプ向け — 有効成分リスト】

✅ 積極的に選ぶ成分:
・セラミド（1,3,6-Ⅱ）— バリア機能を直接補修
・ナイアシンアミド（2-5%）— 赤み・くすみ・毛穴に効く万能成分
・ヒアルロン酸（低分子・高分子混合）— 深部と表面両方に保水
・スクワラン — 皮脂に近い保湿。べたつかない
・パンテノール（ビタB5）— 炎症を鎮静、傷ついた肌を修復

⚠️ 避けるべき成分:
・合成香料（Parfum/Fragrance）— 刺激・アレルギーの原因No.1
・アルコール（Alcohol denat.）— 乾燥・バリア破壊
・高濃度レチノール（初心者）— 1%以上は刺激が強すぎる
・硫酸系界面活性剤（SLS/SLES）— 過度な洗浄で乾燥悪化

💡 今週から試せること:
「ドラッグストアで買える最強コスパ」→ ケアセラAPゲル（セラミド豊富・¥1,800）`,
      },
    ],
  },
  {
    type: "💧 混合肌（Tゾーン脂性）",
    profile: "32歳女性・Tゾーンが午後にテカる・頬は乾燥・ニキビができやすい",
    tabs: [
      {
        label: "🔬 肌タイプ",
        content: `【診断結果】混合肌（Combination / Tzone-Oily）タイプ

━━ あなたの肌の状態 ━━
Tゾーン（額・鼻）：皮脂過多・毛穴詰まりやすい
Uゾーン（頬・顎）：乾燥気味・外的刺激に敏感
ニキビ：おでこ・鼻脇に白ニキビ・黒ニキビが出やすい
毛穴：Tゾーン中心に開きが目立つ

━━ このタイプの特徴 ━━
・朝と夜で肌状態が大きく変わる
・夏は脂っぽく、冬は乾燥でごわつく
・1つのスキンケアで全顔完結させようとすると失敗しやすい
・オイリー肌向け商品を使うと頬が荒れる`,
      },
      {
        label: "📋 ルーティン",
        content: `【混合肌の黄金ルール：「部位別ケア」】

━━ 朝 ━━
① 洗顔（弱酸性フォーム）
② 水分化粧水（全顔）
③ Tゾーン：ノンコメドジェニックの軽いゲル
   Uゾーン：セラミド配合の保湿クリームを厚めに
④ 日焼け止め（オイルフリー・SPF30以上）

━━ 夜 ━━
① ダブル洗顔（クレンジング→洗顔フォーム）
   → Tゾーンを重点的に
② 化粧水（ナイアシンアミド入り）— 全顔
③ 美容液（Tゾーン：BHA配合、Uゾーン：保湿重視）
④ ポイントクリーム（Uゾーンのみ）

━━ 週1ケア ━━
・酵素洗顔 or BHAピーリング（Tゾーンのみ）
・シートマスク（Uゾーン中心に）`,
      },
      {
        label: "🧪 注目成分",
        content: `【混合肌タイプ向け — 有効成分リスト】

✅ Tゾーン（脂性・毛穴）向け:
・BHA（サリチル酸0.5-2%）— 毛穴の黒ずみ・ニキビ菌を溶解
・ナイアシンアミド（5-10%）— 皮脂分泌抑制 + 毛穴を目立たなくする
・グリコール酸（AHA 5%以下）— 古い角質オフ

✅ Uゾーン（乾燥）向け:
・セラミド — バリア機能補修
・ヒアルロン酸 — 保水
・スクワラン — 油分フタ

⚠️ 全顔NGの成分:
・coconut oil（ヤシ油）— コメドジェニック性高い
・合成香料 — 刺激
・高濃度アルコール

💡 今週から試せること:
「COSRX AHA/BHAクラリファイングトナー（¥1,500）」でTゾーンだけ週2回ケア`,
      },
    ],
  },
  {
    type: "✨ 脂性肌（オイリー）",
    profile: "25歳女性・午前中からテカる・ニキビ跡が残りやすい・毛穴が開いている",
    tabs: [
      {
        label: "🔬 肌タイプ",
        content: `【診断結果】脂性肌（Oily）タイプ

━━ あなたの肌の状態 ━━
皮脂量：多め（皮脂腺が活発）
水分量：表面は脂っぽいが内部は意外と乾燥気味
ニキビ：炎症性ニキビ・毛穴詰まりが発生しやすい
毛穴：Tゾーン・頬の毛穴が開いて見える

━━ 重要なポイント ━━
「皮脂=保湿不要」は大きな間違い。
過度な洗浄・保湿をサボると、肌がさらに皮脂を分泌。
「水分たっぷり・油分は最小限」のバランスが正解。`,
      },
      {
        label: "📋 ルーティン",
        content: `【脂性肌の最重要ポイント：「水分で保湿・油分でふたをしない」】

━━ 朝 ━━
① 洗顔（弱酸性フォーム・ぬるま湯）
   → ゴシゴシ洗い禁止。30秒で優しく
② 化粧水（ノンアルコール・ノンオイル）
   → ナイアシンアミド入りで皮脂コントロール
③ ゲルまたは水系乳液（薄づき）
④ UVケア（ジェルタイプ・ノンオイリー）

━━ 夜 ━━
① クレンジング（ミルクかウォーター）
   → オイルクレンジングはNG（皮脂が残る）
② 洗顔フォーム
③ ピーリング美容液（BHA）— 週2〜3回
④ ナイアシンアミド美容液 — 毎日
⑤ 軽いゲルクリーム（少量）

━━ 避けること ━━
・洗顔のしすぎ（1日2回まで）
・吸水系のパウダー乱用（乾燥→皮脂爆発のループ）`,
      },
      {
        label: "🧪 注目成分",
        content: `【脂性肌タイプ向け — 有効成分リスト】

✅ 積極的に選ぶ成分:
・ナイアシンアミド（5-10%）— 皮脂抑制・毛穴縮小・ニキビ跡の色素沈着改善
・BHA（サリチル酸1-2%）— 毛穴の皮脂詰まりを溶かす
・ジンクPCA（亜鉛）— 皮脂分泌を直接抑制
・グリコール酸（AHA）— ターンオーバーを促進、ニキビ跡フェード
・アゼライン酸（10-20%）— 抗菌+ニキビ改善+色素沈着対策の万能酸

⚠️ NGの成分:
・鉱物油（ミネラルオイル）— 毛穴を詰まらせる
・coconut oil — コメドジェニック性最高レベル
・高配合シリコン — 毛穴に蓄積
・高濃度レチノール（単独使用）— 乾燥しすぎると皮脂が増加

💡 今週から試せること:
「Paula's Choice BHA（¥3,800）or COSRX One Step Original Clear Pad（¥1,800）」`,
      },
    ],
  },
];

function SkinSampleSection() {
  const [activeSkin, setActiveSkin] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const sample = SKIN_SAMPLES[activeSkin];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-3">実際の診断結果サンプル</div>
          <h2 className="text-2xl font-black text-gray-900">AIはこんな詳細な診断を出します</h2>
          <p className="text-sm text-gray-500 mt-2">肌悩みを入力するだけで、成分・ルーティン・商品まで個別生成</p>
        </div>

        {/* 診断結果サンプルカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { type: "乾燥敏感肌", score: 86, tag: "K-beautyタイプ", desc: "水分補給を最優先に。セラミド系アイテムがおすすめ", color: "pink" },
            { type: "混合脂性肌", score: 72, tag: "バリア強化タイプ", desc: "Tゾーンの皮脂管理がカギ。ナイアシンアミドが効果的", color: "purple" },
          ].map(card => (
            <div key={card.type} className={`bg-${card.color}-50 border border-${card.color}-200 rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">{card.type}</span>
                <span className={`bg-${card.color}-500 text-white text-xs px-2 py-1 rounded-full`}>{card.tag}</span>
              </div>
              <div className="text-4xl font-black mb-1">{card.score}<span className="text-base text-gray-500">/100</span></div>
              <p className="text-sm text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          {SKIN_SAMPLES.map((s, i) => (
            <button key={i} onClick={() => { setActiveSkin(i); setActiveTab(0); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSkin === i ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`}>
              {s.type}
            </button>
          ))}
        </div>

        <div className="bg-rose-50 rounded-2xl border border-rose-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-rose-100 bg-white">
            <p className="text-xs text-gray-400 font-medium">入力プロフィール</p>
            <p className="text-sm text-gray-700 font-bold">{sample.profile}</p>
          </div>
          <div className="p-5">
            <div className="flex gap-1 mb-4 flex-wrap">
              {sample.tabs.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-rose-500 text-white" : "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="bg-white border border-rose-100 rounded-xl p-4">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{sample.tabs[activeTab].content}</pre>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">※ 実際の診断結果はあなたのプロフィールに合わせてカスタマイズされます</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/tool" className="inline-block bg-rose-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-100">
            自分の肌を無料で診断する →
          </Link>
          <p className="text-xs text-gray-400 mt-2">クレジットカード不要・3回まで無料</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);

  return (
    <main className="min-h-screen bg-rose-50 text-gray-900">
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">✨</div>
            <h2 className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">無制限診断（いつでもキャンセル可）</p>
            <KomojuButton planId="standard" planLabel="プレミアムプラン ¥1,980/月" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}

      {/* Hero — ビジュアル刷新 */}
      <section className="bg-gradient-to-br from-pink-400 via-rose-300 to-orange-200 px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
        <div className="inline-block bg-white/30 backdrop-blur text-rose-800 text-sm font-bold px-4 py-1 rounded-full mb-6 border border-white/40">
          成分科学 × AI診断
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-white drop-shadow-md">
          あなたの肌タイプを<br />
          <span className="text-rose-900">30秒で診断</span>
        </h1>
        <p className="text-lg md:text-xl text-rose-900/80 mb-6 max-w-2xl mx-auto font-medium">
          肌タイプ・悩み・スキンケアルーティンを入力するだけ。<br className="hidden md:block" />
          AIが肌質・毛穴・乾燥・ニキビリスクを即分析。診察料0円。
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-rose-600 font-bold">7タイプ</span>
            <span className="text-rose-800">肌質別に個別処方</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-rose-600 font-bold">200種以上</span>
            <span className="text-rose-800">の成分を解析</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-rose-600 font-bold">K-beauty</span>
            <span className="text-rose-800">国産・韓国コスメ対応</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href="/tool"
            className="bg-rose-700 hover:bg-rose-800 text-white font-black py-4 px-10 rounded-2xl text-xl transition-all shadow-2xl"
          >
            無料で30秒診断する →
          </Link>
          <button
            onClick={() => setShowPayjp(true)}
            disabled={loading}
            className="bg-white/90 text-rose-700 border-2 border-white hover:bg-white font-bold py-4 px-8 rounded-2xl text-lg transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? "処理中..." : "¥1,980/月で無制限"}
          </button>
        </div>
        <p className="text-rose-900/60 text-sm">クレジットカード不要で3回無料 • いつでもキャンセル可能</p>

        {/* 季節バナー */}
        <div className="bg-white/30 backdrop-blur border border-white/40 rounded-2xl p-4 text-center mt-8 mb-2">
          <p className="text-sm text-rose-900 font-bold">🌸 春の肌変化シーズン到来</p>
          <p className="text-xs text-rose-800 mt-1">花粉・紫外線増加で肌荒れが起きやすい時期です。今すぐ肌チェック！</p>
        </div>
        </div>
      </section>

      {/* なぜ差別化できるか */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-3">なぜAI肌診断が必要か</div>
            <h2 className="text-2xl font-black text-gray-900">「なんとなく合いそう」で選ぶと、ほぼ失敗する</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: "🏪",
                label: "コスメカウンター",
                pros: "接客で悩みを聞いてもらえる",
                cons: "自社ブランドのみ推薦。他社の良い商品は紹介されない。成分の説明がない",
                color: "border-gray-200",
              },
              {
                icon: "🏥",
                label: "皮膚科",
                pros: "医学的に正確な診断ができる",
                cons: "保険外は¥5,000〜。スキンケア商品の具体的な成分アドバイスは範囲外",
                color: "border-gray-200",
              },
              {
                icon: "🤖",
                label: "AI美肌診断（当サービス）",
                pros: "成分ベースで全ブランド横断比較。朝夜ルーティン＋NG成分リストまで個別生成",
                cons: "医療行為ではありません（参考情報）",
                color: "border-rose-400 bg-rose-50",
              },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl border-2 p-5 ${item.color}`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-bold text-gray-900 mb-2">{item.label}</p>
                <p className="text-xs text-green-600 mb-1">✅ {item.pros}</p>
                <p className="text-xs text-red-500">⚠️ {item.cons}</p>
              </div>
            ))}
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
            <p className="text-rose-700 text-sm font-bold">
              本サービスは化粧品成分学をベースにしたAI情報提供ツールです。<br />
              医療的な診断・治療を行うものではありません。肌トラブルには皮膚科への相談をお勧めします。
            </p>
          </div>
        </div>
      </section>

      {/* ビフォーアフター */}
      <section className="py-16 px-4 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-3">診断前 vs 診断後</div>
            <h2 className="text-2xl font-black text-gray-900">AI診断で、スキンケアの迷いがなくなる</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6">
              <div className="text-3xl mb-3 text-center">😕</div>
              <h3 className="text-lg font-bold text-gray-600 text-center mb-4">診断前</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">✗</span><span>スキンケア選びに迷う。何が自分に合うか分からない</span></li>
                <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">✗</span><span>口コミだけで選んで、合わなくて無駄遣い</span></li>
                <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">✗</span><span>成分表示が読めず、何が良いのか悪いのか不明</span></li>
                <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">✗</span><span>朝と夜で何を使えばいいか順番が分からない</span></li>
              </ul>
            </div>
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">AI診断後</div>
              <div className="text-3xl mb-3 text-center">✨</div>
              <h3 className="text-lg font-bold text-rose-700 text-center mb-4">診断後</h3>
              <ul className="space-y-3 text-sm text-rose-700">
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5 font-bold">✓</span><span>自分に合ったケアが明確に。成分ベースで選べる</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5 font-bold">✓</span><span>有効成分とNG成分リストで、失敗購入ゼロへ</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5 font-bold">✓</span><span>プチプラ〜ミドルの具体的な商品名まで提案</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5 font-bold">✓</span><span>朝・夜のステップ別ルーティンが即わかる</span></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/tool" className="inline-block bg-rose-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-100 text-lg">
              今すぐ無料で診断する →
            </Link>
          </div>
        </div>
      </section>

      {/* 診断サンプル */}
      <SkinSampleSection />

      {/* こんな悩みを解決 */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-12">こんな悩みを持つ方に</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "😞",
                title: "何を使えばいいか分からない",
                desc: "スキンケア商品が多すぎて自分に合うものを選べない。試してはやめての繰り返しに疲れた。",
              },
              {
                icon: "💸",
                title: "高い商品を試したのに効果なし",
                desc: "有名ブランドや皮膚科推薦品を使っても肌に合わず無駄遣い。成分から選ぶ方法を知りたい。",
              },
              {
                icon: "📱",
                title: "K-beautyを使いこなしたい",
                desc: "韓国スキンケアに興味はあるが成分表示が読めない。何がいい成分で何が悪い成分か教えてほしい。",
              },
            ].map((f) => (
              <div key={f.title} className="bg-rose-50 rounded-2xl p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 診断でわかること */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-12">診断でわかること（4つの視点）</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🔬", title: "肌タイプ詳細診断", desc: "乾燥・混合・脂性・敏感肌の組み合わせパターンと根本原因を分析。「なぜそうなるか」まで説明します。" },
              { icon: "📋", title: "朝・夜のパーソナルルーティン", desc: "何を・どの順番で・どのくらい使えばいいか。ステップごとに目的を説明した具体的なルーティンを提案。" },
              { icon: "🧪", title: "有効成分・NG成分リスト", desc: "あなたの肌悩みに効く成分と避けるべき成分を具体名で明示。商品の裏面成分表を見て選べるようになります。" },
              { icon: "🛒", title: "コスパ商品レコメンド", desc: "国産・K-beautyの中から成分ベースでコスパの良い商品を提案。価格帯別（プチプラ〜ミドル）で対応。" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 flex gap-4">
                <div className="text-3xl shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 text-center bg-rose-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black mb-3">料金プラン</h2>
          <p className="text-gray-500 text-sm mb-10">まずは3回無料でお試しください</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-2">無料プラン</h3>
              <div className="text-4xl font-black mb-4">¥0</div>
              <ul className="text-gray-500 space-y-2 mb-6 text-left text-sm">
                <li className="flex gap-2"><span className="text-green-500">✓</span> 3回まで無料診断</li>
                <li className="flex gap-2"><span className="text-green-500">✓</span> 肌タイプ・ルーティン・成分・商品 全4タブ</li>
                <li className="flex gap-2 text-gray-300"><span>—</span> 4回目以降は有料</li>
              </ul>
              <Link href="/tool" className="block bg-gray-100 hover:bg-gray-200 font-bold py-3 px-6 rounded-xl transition-all text-sm">
                無料で試す
              </Link>
            </div>
            <div className="bg-rose-500 rounded-2xl p-8 text-white">
              <div className="inline-block bg-white text-rose-600 text-xs font-black px-3 py-1 rounded-full mb-3">おすすめ</div>
              <h3 className="text-xl font-bold mb-2">プレミアム</h3>
              <div className="text-4xl font-black mb-1">¥1,980<span className="text-lg font-normal">/月</span></div>
              <p className="text-rose-200 text-xs mb-4">皮膚科の診察1回分以下</p>
              <ul className="space-y-2 mb-6 text-left text-sm">
                <li className="flex gap-2"><span>✓</span> 何度でも無制限に診断</li>
                <li className="flex gap-2"><span>✓</span> 季節・悩みが変わるたびに再診断</li>
                <li className="flex gap-2"><span>✓</span> 全4タブ詳細結果</li>
                <li className="flex gap-2"><span>✓</span> いつでもキャンセル可能</li>
              </ul>
              <button
                onClick={() => setShowPayjp(true)}
                disabled={loading}
                className="w-full bg-white text-rose-600 hover:bg-rose-50 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 text-sm"
              >
                {loading ? "処理中..." : "今すぐ始める →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 肌スコア推移グラフ訴求 */}
      <section className="py-14 px-4 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-3">新機能：スコア推移記録</div>
            <h2 className="text-2xl font-black text-gray-900">診断するたびに肌スコアが記録される</h2>
            <p className="text-sm text-gray-500 mt-2">毎日・毎週診断することで肌の変化をグラフで可視化。ケアの効果を数値で確認できます。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "📈", title: "スコア推移グラフ", desc: "診断するたびにスコアを自動保存。最大10回分の推移をグラフで表示。" },
              { icon: "🎂", title: "推定肌年齢診断", desc: "肌スコアから実年齢との差を推定。ケアの効果が「若返り」で実感できる。" },
              { icon: "🔥", title: "ケアストリーク記録", desc: "毎日のスキンケア日記でストリークを積み上げ。継続モチベーションUP！" },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/tool" className="inline-block bg-rose-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-rose-600 shadow-md text-sm">
              診断してスコアを記録する →
            </Link>
          </div>
        </div>
      </section>

      {/* もっと活用する3選 */}
      <section className="py-8 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-base font-bold text-rose-700 mb-4">✨ AI美肌診断をもっと活用する3選</h2>
        <ol className="space-y-3">
          {[
            { icon: "📅", title: "季節ごとに再診断する", desc: "春夏秋冬で肌の状態は変わります。季節の変わり目に再診断してスキンケアを最適化しよう。" },
            { icon: "🛒", title: "おすすめ商品を実際に試す", desc: "AIが提案した成分・商品を実際に購入して肌の変化を記録。自分に合うルーティンを見つけよう。" },
            { icon: "👥", title: "家族・友人の肌診断もしてあげる", desc: "親や友人の悩みを入力して、AIの肌アドバイスをプレゼントしよう。喜ばれること間違いなし！" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "rgba(225,29,72,0.05)", border: "1px solid rgba(225,29,72,0.12)" }}>
              <span style={{ fontSize: "22px", lineHeight: "1" }}>{item.icon}</span>
              <div>
                <div className="text-rose-800 font-bold text-sm">{i + 1}. {item.title}</div>
                <div className="text-rose-600 text-xs mt-0.5 opacity-80">{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* A8.net スキンケア・美容アフィリエイト */}
      <section className="py-10 px-4 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-5">
            <div className="inline-block bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-2">PR・おすすめ</div>
            <h2 className="text-base font-bold text-gray-800">美肌を加速するおすすめサービス</h2>
          </div>
          <div className="space-y-2">
            {[
              { icon: "💎", label: "韓国美顔器 Dr.tengle", desc: "メイクさん・美容師に愛用される韓国スキンケア美顔器。プロも認める本格ケア", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+4W8BUA+4GDM+TS3OI" },
              { icon: "🌸", label: "Dione 全身脱毛サロン", desc: "敏感肌専門・全身脱毛。肌ケアと並行してムダ毛を処理して清潔な肌へ", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+4V1GMQ+3W7I+HVV0H" },
              { icon: "🧬", label: "CLOUD GYM（遺伝子検査×パーソナル）", desc: "遺伝子検査で自分の体質を知り、スキンケアと並行して体内から美肌を目指す", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+5VCWJ6+4RUO+5YJRM" },
              { icon: "🧘", label: "SOELU オンラインヨガ", desc: "ストレスは肌荒れの大敵。ヨガで自律神経を整えて内側から美肌へ。トライアル1,000円", url: "https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9" },
            ].map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer sponsored"
                className="flex items-center gap-3 bg-white border border-rose-100 rounded-xl p-3 hover:bg-rose-50 transition-colors shadow-sm group">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-rose-700">{item.label} →</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: "診断は医学的なものですか？", a: "本サービスはAIによるエンターテインメント目的の参考情報です。医療診断ではありません。" },
            { q: "写真は保存されますか？", a: "アップロードされた写真はAI分析後に即時削除します。" },
            { q: "無料で使えますか？", a: "基本診断は無料です。詳細レポートは有料プランでご利用いただけます。" },
            { q: "どんな肌質に対応していますか？", a: "乾燥肌・オイリー肌・混合肌・敏感肌の4タイプすべてに対応しています。" },
          ].map((faq) => (
            <div key={faq.q} className="border border-rose-200 rounded-xl p-5 bg-rose-50">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">Q. {faq.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SNS Share */}
      <section className="py-8 px-6 max-w-3xl mx-auto text-center">
        <div className="inline-flex flex-col sm:flex-row gap-2">
          <a
            href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent("AI美肌診断 — 肌タイプ・悩みを入力するだけでAIが成分・スキンケアルーティン・商品まで個別提案✨ 無料で試してみて！ → https://hada-ai.vercel.app #AI美肌診断 #スキンケア #美肌")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Xでシェアする
          </a>
          <a
            href={"https://line.me/R/msg/text/?" + encodeURIComponent("AI美肌診断✨ 肌タイプ・悩みを入力するだけでAIが成分・スキンケアルーティン・商品まで個別提案！無料で試してみて → https://hada-ai.vercel.app")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
            style={{ background: "#06C755" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            LINEで送る
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-400 text-sm bg-white">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal" className="hover:text-gray-600">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-gray-600">利用規約</Link>
        </div>
        <p className="text-xs text-gray-300 mb-2">本サービスはAIによる化粧品成分情報を提供するものです。医療行為・医学的診断には該当しません。肌トラブルには医師へのご相談をお勧めします。</p>
        <p className="mb-3">© 2026 AI美肌診断 — ポッコリラボ</p>
        <div className="border-t border-gray-100 pt-3 text-xs">
          <p className="mb-1">ポッコリラボの他のサービス</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-300">
            <a href="https://uranai-ai-sigma.vercel.app" className="hover:text-gray-500">占いAI</a>
            <a href="https://claim-ai-beryl.vercel.app" className="hover:text-gray-500">クレームAI</a>
            <a href="https://rougo-sim-ai.vercel.app" className="hover:text-gray-500">老後シミュレーターAI</a>
            <a href="https://hojyokin-ai-delta.vercel.app" className="hover:text-gray-500">補助金AI</a>
            <a href="https://kokuhaku-line-ai.vercel.app" className="hover:text-gray-500">告白LINE返信AI</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
