import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filename, contentType, size } = body;

    if (!filename || !contentType || size === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." },
        { status: 400 }
      );
    }

    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 10MB." },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent directory traversal or weird characters
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    const key = `${user.id}/documents/${timestamp}_${sanitizedName}`;

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("Missing R2_BUCKET_NAME");
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Generate signed URL valid for 5 minutes (300 seconds)
    const presignedUrl = await getSignedUrl(getR2Client(), command, {
      expiresIn: 300,
    });

    return NextResponse.json({
      url: presignedUrl,
      key: key,
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
