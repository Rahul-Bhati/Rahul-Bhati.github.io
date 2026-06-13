import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Rahul Bhati — Full-Stack & React Native Developer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Portfolio",
    title: "Full-Stack & React Native Developer building on Solana",
  });
}
