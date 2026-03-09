import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;
const APP_ID = "hada";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

const usageStore = new Map<string, number>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) return NextResponse.json({ error: "しばらくお待ちください" }, { status: 429 });

  const cookieStore = await cookies();
  const email = cookieStore.get("user_email")?.value;
  let isPremium = false;

  if (email) {
    isPremium = await isActiveSubscription(email, APP_ID);
    if (!isPremium) {
      const legacyCookie = cookieStore.get("stripe_premium")?.value;
      isPremium = legacyCookie === "1";
    }
  }

  if (!isPremium) {
    const usage = usageStore.get(ip) || 0;
    if (usage >= FREE_LIMIT) return NextResponse.json({ error: "無料回数を超えました" }, { status: 429 });
    usageStore.set(ip, usage + 1);
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
    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AIの処理中にエラーが発生しました" }, { status: 500 });
  }
}
