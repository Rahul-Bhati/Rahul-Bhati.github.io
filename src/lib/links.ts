import "server-only";
import { db } from "@/lib/db";
import type { LinkGroup } from "@prisma/client";

export type LinkDTO = {
  id: string;
  group: LinkGroup;
  platform: string;
  label: string;
  href: string | null;
  tone: string | null;
  order: number;
  visible: boolean;
};

async function getVisible(group: LinkGroup): Promise<LinkDTO[]> {
  return db.siteLink.findMany({
    where: { group, visible: true },
    orderBy: { order: "asc" },
  });
}

/** Hero pill badges. */
export const getPills = () => getVisible("PILL");

/** Social icons (navbar + footer). */
export const getSocials = () => getVisible("SOCIAL");

/** Find a single social link by platform (e.g. footer "Code on GitHub"). */
export async function getSocialHref(platform: string): Promise<string | null> {
  const row = await db.siteLink.findFirst({
    where: { group: "SOCIAL", platform, visible: true },
  });
  return row?.href ?? null;
}

/** All links (any visibility), grouped — for the admin manager. */
export async function getAllLinksAdmin(): Promise<LinkDTO[]> {
  return db.siteLink.findMany({ orderBy: [{ group: "asc" }, { order: "asc" }] });
}
