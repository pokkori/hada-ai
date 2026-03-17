import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const score = Math.min(100, Math.max(0, parseInt(searchParams.get("score") ?? "75", 10)));
  const skinType = searchParams.get("skinType") ?? "肌タイプ";

  const scoreLabel = score >= 80 ? "美肌レベル：優秀✨" : score >= 70 ? "美肌レベル：良好" : "美肌レベル：要ケア";
  const gradientFrom = score >= 80 ? "#10b981" : score >= 70 ? "#f59e0b" : "#f43f5e";
  const gradientTo = score >= 80 ? "#06b6d4" : score >= 70 ? "#ef4444" : "#ec4899";

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* 背景装飾 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 25% 50%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 75% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)",
            display: "flex",
          }}
        />

        {/* ヘッダー */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>💄</span>
          <span>AI美肌診断スコア</span>
        </div>

        {/* スコア大表示 */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1,
              display: "flex",
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
              display: "flex",
            }}
          >
            /100点
          </span>
        </div>

        {/* スコアラベル */}
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 32,
            padding: "10px 32px",
            fontSize: 28,
            color: "#ffffff",
            fontWeight: 700,
            marginBottom: 20,
            display: "flex",
          }}
        >
          {scoreLabel}
        </div>

        {/* 肌タイプ */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.85)",
            display: "flex",
          }}
        >
          {skinType}
        </div>

        {/* フッター */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 40,
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            display: "flex",
          }}
        >
          hada-ai.vercel.app
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 40,
            fontSize: 20,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>💄</span>
          <span>無料で肌診断</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
