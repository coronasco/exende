import { ImageResponse } from "next/og";

export const alt = "Exende public hiring data and infrastructure APIs";
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
          "radial-gradient(circle at 78% 38%, rgba(36, 119, 255, 0.34), transparent 34%), radial-gradient(circle at 84% 70%, rgba(105, 82, 255, 0.22), transparent 26%), linear-gradient(135deg, #020713 0%, #061329 58%, #020713 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 10 }}>EXENDE</div>
        <div style={{ width: 110, height: 2, background: "#42d9ff" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
        <div style={{ color: "#79dfff", fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
          Public hiring data, observed over time
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.02, fontWeight: 700, letterSpacing: -3 }}>
          The data layer for hiring intelligence.
        </div>
        <div style={{ color: "#b9c8e1", fontSize: 27, lineHeight: 1.4 }}>
          Reviewed public career sources, normalized APIs, historical observation, and infrastructure for autonomous software.
        </div>
      </div>
      <div style={{ display: "flex", gap: 28, color: "#8ca4c9", fontSize: 18, letterSpacing: 2 }}>
        <span>DATA.EXENDE.DEV</span>
        <span>CALLBACK</span>
        <span>RETRY</span>
        <span>RESOLVE</span>
      </div>
    </div>,
    size,
  );
}
