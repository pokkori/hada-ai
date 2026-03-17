import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const score = parseInt(searchParams.get("score") ?? "75");
  const skinType = searchParams.get("skinType") ?? "肌タイプ";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: "#fff",
            marginBottom: 16,
            display: "flex",
          }}
        >
          AI美肌診断スコア
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "#fff",
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span>{score}</span>
          <span
            style={{
              fontSize: 40,
              color: "rgba(255,255,255,0.8)",
              display: "flex",
            }}
          >
            /100
          </span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            marginTop: 16,
            display: "flex",
          }}
        >
          {skinType}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 32,
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
            display: "flex",
          }}
        >
          hada-ai.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
