import { ImageResponse } from "next/og";
import { AUTHOR } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Branded 1200×630 social card. Uses ImageResponse's default font (Latin). */
export function renderOgImage({ title, kicker }: { title: string; kicker: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 100%)",
          color: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a78bfa",
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 64 : 76,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 30,
            color: "#a3a3a3",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
              color: "#fff",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            R
          </div>
          {AUTHOR}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
