"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-rose-50 text-gray-900">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-rose-500 text-white text-sm font-bold px-4 py-1 rounded-full mb-6">
          AI × 肌診断
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
          あなたの肌を、<br />
          <span className="text-rose-500">AIがパーソナル診断</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          肌タイプ・悩み・ライフスタイルを入力するだけで、
          あなただけのスキンケアルーティンと成分解析をAIが自動生成。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/tool"
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            無料で診断する（3回）
          </Link>
          <button
            onClick={startCheckout}
            disabled={loading}
            className="bg-white text-rose-600 border-2 border-rose-500 hover:bg-rose-50 font-bold py-4 px-8 rounded-xl text-lg transition-all disabled:opacity-50"
          >
            {loading ? "処理中..." : "¥980/月で無制限に使う"}
          </button>
        </div>
        <p className="text-gray-400 text-sm">クレジットカード不要で3回無料 • いつでもキャンセル可能</p>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">こんな悩みを解決</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "😞",
                title: "何を使えばいいか分からない",
                desc: "スキンケア商品が多すぎて、自分に合うものを選べない。試してはやめての繰り返し。",
              },
              {
                icon: "💸",
                title: "高い商品を試したのに効果なし",
                desc: "有名ブランドを使っても肌に合わず無駄遣い。成分から選ぶ方法を知りたい。",
              },
              {
                icon: "📱",
                title: "K-beautyを試したいけど情報が多すぎ",
                desc: "韓国スキンケアに興味はあるが、日本語の詳しい情報がなく何から始めればいいか謎。",
              },
            ].map((f) => (
              <div key={f.title} className="bg-rose-50 rounded-2xl p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">診断でわかること</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🔬", title: "肌タイプ詳細診断", desc: "乾燥・混合・脂性・敏感肌の組み合わせパターンを細かく分析" },
              { icon: "📋", title: "パーソナルルーティン", desc: "朝・夜の具体的なスキンケア手順と各ステップの目的を解説" },
              { icon: "🧪", title: "注目すべき成分解説", desc: "あなたの肌悩みに効く有効成分と避けるべき成分を明示" },
              { icon: "🛒", title: "商品レコメンド", desc: "成分ベースで選んだ、コスパの良い国産・K-beauty商品を提案" },
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

      {/* Social proof */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">数字で見るメリット</h2>
          <p className="text-gray-500 text-center mb-10">肌に合った成分を選ぶだけで、スキンケアの効果は<span className="text-rose-500 font-bold">3倍以上</span>変わります</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { stat: "3回", desc: "無料で診断できます" },
              { stat: "4項目", desc: "肌診断・ルーティン・成分・商品" },
              { stat: "2分", desc: "入力から診断結果まで" },
              { stat: "¥980", desc: "月額。皮膚科の1回分より安い" },
            ].map((s) => (
              <div key={s.stat} className="bg-rose-50 rounded-xl p-5 flex items-center gap-4">
                <div className="text-3xl font-black text-rose-500">{s.stat}</div>
                <div className="text-gray-600">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12">シンプルな料金体系</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-2">無料プラン</h3>
              <div className="text-4xl font-black mb-4">¥0</div>
              <ul className="text-gray-500 space-y-2 mb-6 text-left text-sm">
                <li>✓ 3回まで無料診断</li>
                <li>✓ 全4タブ診断結果</li>
                <li>✗ 回数制限あり</li>
              </ul>
              <Link href="/tool" className="block bg-gray-100 hover:bg-gray-200 font-bold py-3 px-6 rounded-xl transition-all">
                無料で試す
              </Link>
            </div>
            <div className="bg-rose-500 rounded-2xl p-8 text-white">
              <div className="inline-block bg-white text-rose-600 text-xs font-black px-3 py-1 rounded-full mb-3">おすすめ</div>
              <h3 className="text-xl font-bold mb-2">プレミアム</h3>
              <div className="text-4xl font-black mb-4">¥980<span className="text-lg font-normal">/月</span></div>
              <ul className="space-y-2 mb-6 text-left text-sm">
                <li>✓ 無制限に診断できる</li>
                <li>✓ 4タブ詳細結果</li>
                <li>✓ いつでもキャンセル</li>
              </ul>
              <button
                onClick={startCheckout}
                disabled={loading}
                className="w-full bg-white text-rose-600 hover:bg-rose-50 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? "処理中..." : "今すぐ始める"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal" className="hover:text-gray-600">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-gray-600">利用規約</Link>
        </div>
        <p>© 2025 AI美肌診断</p>
      </footer>
    </main>
  );
}
