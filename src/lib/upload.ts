import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const uploadPattern = /^\/media\/([a-f0-9-]+\.(?:jpg|png|webp))$/;

function uploadDirectory() {
  return path.join(process.cwd(), "data", "uploads");
}

function detectImageType(buffer: Buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
    return { extension: "jpg", mime: "image/jpeg" };
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return { extension: "png", mime: "image/png" };
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP"
  )
    return { extension: "webp", mime: "image/webp" };
  return null;
}

export async function saveUploadedCover(file: File | null) {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_FILE_SIZE) throw new Error("封面图片不能超过 3 MB。");
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = detectImageType(buffer);
  if (!type) throw new Error("仅支持有效的 JPG、PNG 或 WebP 图片。");

  let optimized: Buffer;
  try {
    optimized = await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS })
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new Error("图片无法解码或像素尺寸过大，请更换后重试。");
  }

  await mkdir(uploadDirectory(), { recursive: true });
  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(uploadDirectory(), filename), optimized, { flag: "wx" });
  return `/media/${filename}`;
}

export async function removeUploadedCover(coverUrl: string | null | undefined) {
  const match = coverUrl?.match(uploadPattern);
  if (!match) return;
  try {
    await unlink(path.join(uploadDirectory(), match[1]));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`Unable to remove uploaded cover ${match[1]}: ${(error as Error).message}`);
    }
  }
}
