import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;
const COOKIE_KEY = "hada_use_count";

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
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

  const isPremium = req.cookies.get("premium")?.value === "1";
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }

  const { skinType, concerns, routine, lifestyle } = await req.json();
  if (!concerns?.trim()) return NextResponse.json({ error: "肌の悩みを入力してください" }, { status: 400 });

  const prompt = `あなたは日本のトップスキンケアアドバイザーです。以下のユーザー情報をもとに、詳細な肌診断・1週間後の肌予測・パーソナライズドスキンケアアドバイスを提供してください。

【ユーザー情報】
肌タイプ: ${skinType}
肌の悩み: ${concerns}
現在のスキンケア: ${routine || "記載なし"}
ライフスタイル: ${lifestyle}

以下の形式で出力してください（各セクションを --- で区切る）：

## 肌診断

${skinType}の特徴と、記載された悩みの根本原因を分析してください。
・現在の肌状態の評価
・悩みが起きている原因（3〜4点、科学的根拠を含める）
・改善の優先順位（最重要→重要→任意の順）
・今の肌の「一番の弱点」を一言で

【1週間後の肌予測】
今日から正しいケアを始めた場合、1週間後・1ヶ月後にどのような変化が期待できるか具体的に記載してください。
・1週間後: ○○の改善が期待できます（理由）
・1ヶ月後: ○○が目立ちにくくなり、○○の手触りに近づきます

---

## スキンケアルーティン

朝と夜それぞれの具体的なステップを記載してください。

【朝のルーティン（5分でできる）】
Step1: ○○（理由・使い方・肌への効果）
Step2: ○○（理由・使い方・肌への効果）
Step3: ○○（理由・使い方・肌への効果）
Step4: ○○（理由・使い方・肌への効果）

【夜のルーティン（10分スペシャルケア）】
Step1: ○○（理由・使い方・肌への効果）
Step2: ○○（理由・使い方・肌への効果）
Step3: ○○（理由・使い方・肌への効果）
Step4: ○○（理由・使い方・肌への効果）

【週1〜2回のスペシャルケア】
・○○ケア（効果・タイミング）

---

## 注目成分

この肌タイプ・悩みに特に効果的な成分を5つ解説してください。

【積極的に取り入れたい成分】
・成分名: 効果と選び方のポイント（なぜこの肌質に合うか）
（5つ記載）

【この肌質では避けた方がいい成分・注意点】
・○○: 理由と代替成分の提案

---

## 商品レコメンド

以下の各カテゴリで、コスパの良い商品を1〜2つずつ提案してください（実在する商品名を推奨）。

【洗顔料】
・商品名（メーカー）: おすすめ理由・価格帯・どこで買えるか（ドラッグストア/Amazon/公式）

【化粧水】
・商品名（メーカー）: おすすめ理由・価格帯・どこで買えるか

【保湿クリーム/乳液】
・商品名（メーカー）: おすすめ理由・価格帯・どこで買えるか

【スペシャルケア（悩み別）】
・商品名（メーカー）: おすすめ理由・価格帯・どこで買えるか

【Amazonで手軽に買えるおすすめ】
・Amazon人気商品1〜2点（商品名・ASIN番号不要、商品名とメーカーのみ）

K-beautyの商品も積極的に取り入れてください。国内・海外含めコスパ重視で選定してください。`;

  try {
    const newCount = cookieCount + 1;
    const stream = getClient().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2800,
      messages: [{ role: "user", content: prompt }],
    });
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.enqueue(encoder.encode(`\nDONE:${JSON.stringify({ count: newCount })}`));
          controller.close();
        } catch (err) { console.error(err); controller.error(err); }
      },
    });
    const headers: Record<string, string> = {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
    };
    if (!isPremium) {
      headers["Set-Cookie"] = `${COOKIE_KEY}=${newCount}; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure; Path=/`;
    }
    return new Response(readable, { headers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AIの処理中にエラーが発生しました" }, { status: 500 });
  }
}
