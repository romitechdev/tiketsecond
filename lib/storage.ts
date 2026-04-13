import { supabaseAdmin } from "@/lib/supabase/admin";

const DEFAULT_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "ticket-assets";
let bucketReady: Promise<void> | null = null;

function ensureBucketPath(path: string) {
  return path.replace(/^\/+/, "");
}

async function ensureBucketExists() {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
      if (error) {
        throw new Error(error.message || "Gagal memeriksa bucket storage");
      }

      const exists = (buckets || []).some((bucket) => bucket.name === DEFAULT_BUCKET);
      if (exists) return;

      const { error: createError } = await supabaseAdmin.storage.createBucket(DEFAULT_BUCKET, {
        public: true,
      });

      if (createError && !createError.message.toLowerCase().includes("already exists")) {
        throw new Error(createError.message || "Gagal membuat bucket storage");
      }
    })();
  }

  await bucketReady;
}

export async function uploadImageToStorage(input: {
  folder: "tickets" | "profiles";
  buffer: Buffer;
  contentType: string;
  extension: string;
}) {
  await ensureBucketExists();

  const ext = input.extension.toLowerCase();
  const fileName = `${input.folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const storagePath = ensureBucketPath(fileName);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(DEFAULT_BUCKET)
    .upload(storagePath, input.buffer, {
      contentType: input.contentType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Gagal upload gambar ke storage");
  }

  const { data } = supabaseAdmin.storage.from(DEFAULT_BUCKET).getPublicUrl(storagePath);
  return {
    publicUrl: data.publicUrl,
    bucket: DEFAULT_BUCKET,
    path: storagePath,
  };
}

export async function deleteImageFromStorageByUrl(url: string | null | undefined) {
  if (!url) return;

  const marker = `/storage/v1/object/public/${DEFAULT_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const rawPath = url.slice(idx + marker.length);
  const path = ensureBucketPath(decodeURIComponent(rawPath));
  if (!path) return;

  await supabaseAdmin.storage.from(DEFAULT_BUCKET).remove([path]);
}
