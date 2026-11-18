import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { processLegacyRecords, type LegacyRecord } from "../src/lib/legacy-migration";

const dryRun = process.argv.includes("--dry-run");
const overwrite = process.argv.includes("--overwrite");
const db = new PrismaClient();

async function main() {
  const records = JSON.parse(
    await readFile(path.join(process.cwd(), "legacy", "export.json"), "utf8"),
  ) as LegacyRecord[];
  const result = processLegacyRecords(records);
  let database: { created: number; preserved: number; overwritten: number } | null = null;

  if (!dryRun && result.entries.length) {
    const existing = await db.content.findMany({
      where: { slug: { in: result.entries.map((entry) => entry.slug) } },
      select: { slug: true },
    });
    const existingSlugs = new Set(existing.map((entry) => entry.slug));
    const pending = result.entries.filter((entry) => overwrite || !existingSlugs.has(entry.slug));
    if (pending.length) {
      await db.$transaction(
        pending.map((entry) =>
          overwrite
            ? db.content.upsert({ where: { slug: entry.slug }, update: entry, create: entry })
            : db.content.create({ data: entry }),
        ),
      );
    }
    database = {
      created: result.entries.length - existingSlugs.size,
      preserved: overwrite ? 0 : existingSlugs.size,
      overwritten: overwrite ? existingSlugs.size : 0,
    };
  }

  await writeFile(
    path.join(process.cwd(), "legacy", "redirects.generated.json"),
    `${JSON.stringify(result.redirects, null, 2)}\n`,
  );
  await mkdir(path.join(process.cwd(), "reports"), { recursive: true });
  await writeFile(
    path.join(process.cwd(), "reports", "legacy-migration.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), dryRun, overwrite, ...result.summary, ...(database ? { database } : {}), decisions: result.decisions }, null, 2)}\n`,
  );

  console.log(
    JSON.stringify(
      { dryRun, overwrite, ...result.summary, ...(database ? { database } : {}) },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
