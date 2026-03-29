import { S3Client } from "@aws-sdk/client-s3";

let _r2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (_r2Client) return _r2Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId) throw new Error("Missing R2_ACCOUNT_ID");
  if (!accessKeyId) throw new Error("Missing R2_ACCESS_KEY_ID");
  if (!secretAccessKey) throw new Error("Missing R2_SECRET_ACCESS_KEY");

  _r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return _r2Client;
}

// Keep backward-compatible named export (lazy getter)
export const r2Client = new Proxy({} as S3Client, {
  get(_target, prop) {
    return (getR2Client() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
