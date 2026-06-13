/**
 * Create the public `media` storage bucket in Supabase if it doesn't exist.
 * Idempotent. Run: npm run setup-storage
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const BUCKET = "media";
const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;

  if (buckets.some((b) => b.name === BUCKET)) {
    console.log(`Bucket "${BUCKET}" already exists.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "52428800", // 50 MB (Supabase free-tier global cap)
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/avif",
      "video/mp4",
      "video/webm",
    ],
  });
  if (error) throw error;
  console.log(`Created public bucket "${BUCKET}".`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
