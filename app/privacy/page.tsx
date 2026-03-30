import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <Link href="/" className="font-bold text-gray-900"> AI美肌診断</Link>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-12 text-sm text-gray-700 leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">プライバシーポリシー</h1>
        <section><h2 className="font-bold text-base mb-2">1. 収集する情報</h2><ul className="list-disc list-inside space-y-1 text-gray-600"><li>決済時にPAY.JP（PAY.JP株式会社）が収集する支払情報（当社はカード番号を保持しません）</li><li>ブラウザのCookieおよびlocalStorage（利用回数の管理）</li><li>アクセスログ（IPアドレス・ブラウザ種別・閲覧ページ）</li></ul></section>
        <section><h2 className="font-bold text-base mb-2">2. 利用目的</h2><ul className="list-disc list-inside space-y-1 text-gray-600"><li>サービスの提供・運営・改善</li><li>不正利用の検知と防止</li></ul></section>
        <section><h2 className="font-bold text-base mb-2">3. 第三者提供</h2><p>法令に基づく場合および決済処理のためPAY.JP（PAY.JP株式会社）に提供する場合を除き、第三者への提供は行いません。PAY.JPのプライバシーポリシーについてはhttps://pay.jpをご参照ください。</p></section>
        <section><h2 className="font-bold text-base mb-2">4. 外部送信規律に基づく情報送信</h2><p className="mb-2">本サービスでは、電気通信事業法の外部送信規律に基づき、以下の外部サービスにデータを送信しています。</p><table className="w-full text-left border-collapse text-xs text-gray-600"><thead><tr className="border-b"><th className="py-2 pr-2">送信先</th><th className="py-2 pr-2">目的</th><th className="py-2">送信される情報</th></tr></thead><tbody><tr className="border-b"><td className="py-2 pr-2">Anthropic（Claude API）</td><td className="py-2 pr-2">AI診断結果の生成</td><td className="py-2">ユーザーがアップロードした画像・入力テキスト</td></tr><tr className="border-b"><td className="py-2 pr-2">PAY.JP（PAY株式会社）</td><td className="py-2 pr-2">決済処理</td><td className="py-2">決済に必要な情報</td></tr><tr><td className="py-2 pr-2">Vercel Inc.</td><td className="py-2 pr-2">ホスティング・アクセス解析</td><td className="py-2">ページビュー・デバイス情報</td></tr></tbody></table></section>
        <section><h2 className="font-bold text-base mb-2">5. お問い合わせ</h2><p>X(Twitter) @levona_design へのDM</p></section>
        <p className="text-gray-400 text-xs pt-4 border-t">制定日：2025年1月1日</p>
      </div>
    </main>
  );
}
