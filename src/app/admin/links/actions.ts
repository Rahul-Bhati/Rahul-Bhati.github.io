"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

async function requireAuth() {
  if (!(await getSession())) throw new Error("Unauthorized");
}

const linkSchema = z.object({
  id: z.string().optional(),
  group: z.enum(["SOCIAL", "PILL", "FOOTER"]),
  platform: z.string().trim().min(1, "Platform is required.").max(40),
  label: z.string().trim().min(1, "Label is required.").max(120),
  href: z.string().trim().url().optional().or(z.literal("")).nullable(),
  tone: z.string().trim().max(20).optional().or(z.literal("")).nullable(),
  order: z.coerce.number().int().min(0).default(0),
  visible: z.boolean().default(true),
});

export type LinkInput = z.input<typeof linkSchema>;
export type LinkSaveResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function revalidateSite() {
  // Links appear in the shared layout (navbar/footer) + hero — refresh everything.
  revalidatePath("/", "layout");
}

export async function saveLink(input: LinkInput): Promise<LinkSaveResult> {
  await requireAuth();
  const parsed = linkSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;
  const data = {
    group: d.group,
    platform: d.platform.toLowerCase(),
    label: d.label,
    href: d.href || null,
    tone: d.tone || null,
    order: d.order,
    visible: d.visible,
  };
  const saved = d.id
    ? await db.siteLink.update({ where: { id: d.id }, data, select: { id: true } })
    : await db.siteLink.create({ data, select: { id: true } });
  revalidateSite();
  return { ok: true, id: saved.id };
}

export async function deleteLink(id: string): Promise<{ ok: boolean }> {
  await requireAuth();
  await db.siteLink.delete({ where: { id } });
  revalidateSite();
  return { ok: true };
}
