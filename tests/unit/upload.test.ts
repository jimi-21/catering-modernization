import { readFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { removeUploadedCover, saveUploadedCover } from "@/lib/upload";

describe("image uploads", () => {
  it("decodes, normalizes and removes an uploaded cover", async () => {
    const source = await readFile(path.join(process.cwd(), "public/images/meal-balanced.webp"));
    const file = new File([source], "meal.webp");
    const url = await saveUploadedCover(file);
    expect(url).toMatch(/^\/media\/[a-f0-9-]+\.webp$/);
    const filename = url!.replace("/media/", "");
    const stored = path.join(process.cwd(), "data/uploads", filename);
    const metadata = await sharp(await readFile(stored)).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBeLessThanOrEqual(1920);
    await removeUploadedCover(url);
    await expect(access(stored)).rejects.toThrow();
  });

  it("ignores untrusted browser MIME and rejects corrupt images", async () => {
    const source = await readFile(path.join(process.cwd(), "public/images/meal-balanced.webp"));
    const url = await saveUploadedCover(new File([source], "fake.png", { type: "image/png" }));
    expect(url).toMatch(/\.webp$/);
    await removeUploadedCover(url);
    const corrupt = Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x01]);
    await expect(
      saveUploadedCover(new File([corrupt], "broken.jpg", { type: "image/jpeg" })),
    ).rejects.toThrow("无法解码");
  });

  it("never removes files outside the managed upload namespace", async () => {
    await expect(removeUploadedCover("/images/hero-kitchen.webp")).resolves.toBeUndefined();
    await expect(removeUploadedCover("/media/../../secret")).resolves.toBeUndefined();
  });
});
