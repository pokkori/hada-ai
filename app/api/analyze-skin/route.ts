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

  let imageBase64: string;
  let mimeType: string;

  try {
    const body = await req.json();
    imageBase64 = body.imageBase64;
    mimeType = body.mimeType || "image/jpeg";
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  if (!imageBase64) {
    return NextResponse.json({ error: "画像データが必要です" }, { status: 400 });
  }

  // Validate mimeType
  const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validMimeTypes.includes(mimeType)) {
    mimeType = "image/jpeg";
  }

  const prompt = `この写真から肌の状態を詳しく分析してください。美容皮膚科の専門知識を持つAIとして、以下の形式で出力してください（各セクションを --- で区切る）：

## 肌診断

まず、写真から見える肌の状態への共感メッセージを2-3文で書いてください。
「写真で拝見したところ、〜という状態が見受けられますね」という形で始めてください。

その後、以下を科学的に分析してください：
・写真から読み取れる肌タイプ（乾燥/混合/脂性/敏感肌）
・毛穴の目立ち度（1-10点で評価）
・肌トーン・くすみの状態
・推定水分量と油分バランス
・改善が必要な部位と優先順位

【写真解析から見えるNG習慣】
・写真の肌状態から推測される2点のNG習慣（「実は〜していませんか？」形式）

---

## スキンケアルーティン

写真の肌状態に合わせた具体的なルーティンを提案してください。

【朝のルーティン（5分でできる）】
Step1: ○○（写真の肌状態に合わせた理由・使い方・成分メカニズム）
Step2: ○○
Step3: ○○
Step4: ○○

【夜のルーティン（10分スペシャルケア）】
Step1: ○○（写真で見えた肌課題を解決するための理由）
Step2: ○○
Step3: ○○
Step4: ○○

【週1〜2回のスペシャルケア】
・○○ケア（写真の肌課題に特化した内容）

---

## 注目成分

写真から判断したこの肌状態に特に効果的な成分を5つ、なぜ効くかのメカニズムとともに解説してください。

【積極的に取り入れたい成分】
・成分名: 効果・メカニズム（なぜ今の肌状態に合うか）
（5つ記載）

【この肌状態では避けた方がいい成分・注意点】
・○○: 理由とメカニズム

---

## 商品レコメンド

写真で確認した肌状態に最適な商品を提案してください。

【洗顔料】
・商品名（メーカー）: おすすめ理由・価格帯

【化粧水】
・商品名（メーカー）: おすすめ理由・価格帯

【保湿クリーム/乳液】
・商品名（メーカー）: おすすめ理由・価格帯

【スペシャルケア（写真の悩み別）】
・商品名（メーカー）: おすすめ理由・価格帯

K-beautyの商品も積極的に取り入れてください。コスパ重視で選定してください。

---

最後に、以下の形式でシェア文を必ず出力してください：

【📱 シェアするとしたら】
「AIが私の写真を見て肌を分析してくれた！まさかの○○が原因だった…✨ 2週間後が楽しみ #AI美肌診断 #カメラ肌診断 #スキンケア」

重要：医療診断ではありません。スキンケアの参考情報としてお使いください。`;

  try {
    const newCount = cookieCount + 1;
    const stream = getClient().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      }],
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
