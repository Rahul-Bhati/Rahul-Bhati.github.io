import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon — brand monogram on the violet→fuchsia gradient.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
          color: "#ffffff",
          fontSize: 110,
          fontWeight: 700,
        }}
      >
        R
      </div>
    ),
    { ...size },
  );
}
