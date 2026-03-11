import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI美肌診断｜自撮り1枚でパーソナルスキンケアをAIが提案";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 12, display: "flex" }}>✨</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "#9d174d", marginBottom: 12, textAlign: "center", display: "flex" }}>
          AI美肌診断
        </div>
        <div style={{ fontSize: 26, color: "#be185d", textAlign: "center", maxWidth: 900, marginBottom: 8, display: "flex" }}>
          自撮り1枚でパーソナルスキンケアをAIが提案
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {["肌タイプ診断", "成分分析", "商品レコメンド", "¥980/月〜"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(157,23,77,0.1)",
                border: "1px solid rgba(157,23,77,0.3)",
                borderRadius: 24,
                fontSize: 18,
                color: "#9d174d",
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
