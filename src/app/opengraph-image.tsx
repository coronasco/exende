import { ImageResponse } from "next/og";

export const alt = "Exende Jobs Data API & Hiring Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 78px",
        color: "#f7fbff",
        background:
          "radial-gradient(circle at 78% 38%, rgba(93, 143, 173, 0.23), transparent 34%), radial-gradient(circle at 84% 70%, rgba(91, 116, 145, 0.15), transparent 26%), linear-gradient(135deg, #03080e 0%, #0b1823 58%, #03080e 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="8.2" stroke="#f0f5fa" strokeWidth="1.4"/><ellipse cx="16" cy="16" rx="15" ry="4.9" transform="rotate(-34 16 16)" stroke="#f0f5fa" strokeWidth="1.8"/></svg>
        <div style={{ fontSize: 30, fontWeight: 400, letterSpacing: 9 }}>EXENDE</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
        <div style={{ color: "#a4d6f4", fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
          Jobs & Hiring Data API
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.06, fontWeight: 400, letterSpacing: -3 }}>
          The data layer for hiring intelligence.
        </div>
        <div style={{ color: "#b9c8e1", fontSize: 27, lineHeight: 1.4 }}>
          Search normalized public job listings. Understand observed hiring changes.
        </div>
      </div>
      <div style={{ display: "flex", gap: 28, color: "#8ca4c9", fontSize: 18, letterSpacing: 2 }}>
        <span>WWW.EXENDE.DEV</span>
        <span>STRUCTURED DATA · DOCUMENTED HISTORY</span>
      </div>
    </div>,
    size,
  );
}
