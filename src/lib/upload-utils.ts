import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Uploads a file directly to Cloudflare R2 via presigned URL and saves metadata to Supabase.
 * @param file The File object selected by the user
 * @returns The Supabase user_documents record id
 */
export async function uploadDocument(file: File) {
  // 1. Get presigned URL
  const response = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to get upload URL");
  }

  const { url, key } = await response.json();

  // 2. Upload file directly to R2
  const uploadResponse = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to Cloudflare R2");
  }

  // 3. Save metadata to Supabase
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("user_documents")
    .insert([
      {
        user_id: user.user.id,
        file_name: file.name,
        r2_object_key: key,
        content_type: file.type,
        size: file.size,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    console.error("Supabase insert error:", error);
    throw new Error("Failed to save file metadata to database");
  }

  return data;
}
