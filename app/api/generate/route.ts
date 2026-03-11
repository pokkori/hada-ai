import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;
const COOKIE_KEY = "hada_use_count";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) return NextResponse.json({ error: "しばらくお待ちください" }, { status: 429 });

  const isPremium = req.cookies.get("premium")?.value === "1" || req.cookies.get("stripe_premium")?.value === "1";
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }

  const { skinType, concerns, routine, lifestyle } = await req.json();
  if (!concerns?.trim()) return NextResponse.json({ error: "肌の悩みを入力してください" }, { status: 400 });

  const prompt = `あなたは日本のトップスキンケアアドバイザーです。以下のユーザー情報をもとに、詳細な肌診断とパーソナライズドスキンケアアドバイスを提供してください。

【ユーザー情報】
肌タイプ: ${skinType}
肌の悩み: ${concerns}
現在のスキンケア: ${routine || "記載なし"}
ライフスタイル: ${lifestyle}

以下の形式で出力してください（各セクションを --- で区切る）：

## 肌診断

${skinType}の特徴と、記載された悩みの根本原因を分析してください。
・現在の肌状態の評価
・悩みが起きている原因（3〜4点）
・改善の優先順位

---

## スキンケアルーティン

朝と夜それぞれの具体的なステップを記載してください。

【朝のルーティン】
Step1: ○○（理由・使い方）
Step2: ○○（理由・使い方）

【夜のルーティン】
Step1: ○○（理由・使い方）
Step2: ○○（理由・使い方）

週1〜2回取り入れると良いケアも1〜2つ追加してください。

---

## 注目成分

この肌タイプ・悩みに特に効果的な成分を5つ解説してください。

【積極的に取り入れたい成分】
・成分名: 効果と選び方のポイント
（5つ記載）

【この肌質では避けた方がいい成分・注意点】
・○○: 理由

---

## 商品レコメンド

以下の各カテゴリで、コスパの良い商品を1〜2つずつ提案してください（実在する商品名を推奨）。

【洗顔料】
・商品名（メーカー）: おすすめ理由・価格帯

【化粧水】
・商品名（メーカー）: おすすめ理由・価格帯

【保湿クリーム/乳液】
・商品名（メーカー）: おすすめ理由・価格帯

【スペシャルケア（悩み別）】
・商品名（メーカー）: おすすめ理由・価格帯

K-beautyの商品も積極的に取り入れてください。`;

  try {
    const message = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }],
    });
    const result = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result, count: newCount });
    if (!isPremium) {
      res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", httpOnly: true, secure: true });
    }
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AIの処理中にエラーが発生しました" }, { status: 500 });
  }
}
