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

  const prompt = `あなたは皮膚科専門医の知識を持つ美容アドバイザーであり、100以上のコスメブランドを熟知しています。ユーザーの感情に深く共鳴し、「言語化できなかった気持ちを代わりに言葉にする」専門家でもあります。
ユーザーは「正確な答え」ではなく「自分のことをわかってくれた感覚」と「次の行動への後押し」を求めています。

## 出力の絶対ルール

1. **感情への共感を最初の3文で実現する**
   - ユーザーが入力した肌の悩みから「この人はどんな気持ちでいるか」を読み取る
   - 「${concerns}という悩みは、〜という気持ちになりますよね」と明示的に共感する
   - ユーザーが「わかってもらえた」と感じてから本題に入る

2. **驚き・発見の演出**
   - ユーザーが「こんなこと気づかなかった」と感じるインサイトを1つ必ず含める
   - 「実は〜」「意外なことに〜」「多くの方が知らないことですが〜」という書き出しを使う
   - 「なぜその成分が効くか」のメカニズム説明（信頼性）を盛り込む

3. **肌質改善タイムライン**
   - 「2週間で○○、1ヶ月で○○」という具体的な改善ロードマップを示す
   - NG習慣の指摘（「実はやってはいけない○○」）を含める

4. **SNS映え設計**
   - 出力の最後に「シェアするとしたら：『${skinType}の私の肌スコアが○○点だった！まさかの原因は…#AI美肌診断 #スキンケア』」という形式のシェア文を必ず含める
   - 感情が動く・驚きがある内容にすること

5. **絵文字・改行の積極活用**
   - 感情の盛り上がりに合わせて絵文字を使う
   - 長い段落を避け、3-4行ごとに改行する

【ユーザー情報】
肌タイプ: ${skinType}
肌の悩み: ${concerns}
現在のスキンケア: ${routine || "記載なし"}
ライフスタイル: ${lifestyle}

以下の形式で出力してください（各セクションを --- で区切る）：

## 肌診断

まず、${concerns}というお悩みへの共感メッセージを2-3文で書いてください（「〜という気持ちになりますよね」形式）。

その後、${skinType}の特徴と悩みの根本原因を科学的に分析してください。
・現在の肌状態の評価
・悩みが起きている原因（3〜4点、成分・メカニズムを含む科学的根拠付き）
・改善の優先順位（最重要→重要→任意の順）
・今の肌の「一番の弱点」を一言で
・**実はやってはいけないNG習慣**（1〜2点・驚きのインサイト）

【肌改善タイムライン】
今日から正しいケアを始めた場合の変化：
・2週間後: ○○の改善が期待できます（メカニズム説明付き）
・1ヶ月後: ○○が目立ちにくくなり、○○の手触りに近づきます

---

## スキンケアルーティン

朝と夜それぞれの具体的なステップを記載してください。

【朝のルーティン（5分でできる）】
Step1: ○○（理由・使い方・肌への効果・成分メカニズム）
Step2: ○○（理由・使い方・肌への効果・成分メカニズム）
Step3: ○○（理由・使い方・肌への効果・成分メカニズム）
Step4: ○○（理由・使い方・肌への効果・成分メカニズム）

【夜のルーティン（10分スペシャルケア）】
Step1: ○○（理由・使い方・肌への効果・成分メカニズム）
Step2: ○○（理由・使い方・肌への効果・成分メカニズム）
Step3: ○○（理由・使い方・肌への効果・成分メカニズム）
Step4: ○○（理由・使い方・肌への効果・成分メカニズム）

【週1〜2回のスペシャルケア】
・○○ケア（効果・タイミング・なぜ必要か）

---

## 注目成分

この肌タイプ・悩みに特に効果的な成分を5つ、なぜ効くかのメカニズムとともに解説してください。

【積極的に取り入れたい成分（LIPS・美容インフルエンサーが言わない深い理由も）】
・成分名: 効果・選び方・メカニズム（なぜこの肌質に合うか科学的に説明）
（5つ記載）

【この肌質では避けた方がいい成分・注意点】
・○○: 理由（メカニズム）と代替成分の提案

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

【Amazonで手軽に買えるおすすめ（アフィリリンク設置予定枠）】
・Amazon人気商品1〜2点（商品名・メーカー。「Amazonで探す →」というテキストを各商品の後に追加）

K-beautyの商品も積極的に取り入れてください。国内・海外含めコスパ重視で選定してください。

---

最後に、以下の形式でシェア文を必ず出力してください：

【📱 シェアするとしたら】
「${skinType}の私がAI美肌診断を受けたら、まさかの○○が原因だった…！正しいケアを始めて2週間、肌が変わってきた✨ #AI美肌診断 #スキンケア #${skinType}」`;

  try {
    const newCount = cookieCount + 1;
    const stream = getClient().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
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
