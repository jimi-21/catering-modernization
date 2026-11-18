import { request } from "node:https";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = new URL(process.env.LOAD_TEST_BASE_URL ?? "https://localhost");
if (baseUrl.hostname !== "localhost" && baseUrl.hostname !== "127.0.0.1") {
  throw new Error("Load checks are restricted to a local deployment.");
}
const total = Number(process.env.LOAD_TEST_REQUESTS ?? 160);
const concurrency = Number(process.env.LOAD_TEST_CONCURRENCY ?? 16);
const routes = ["/", "/services", "/cases", "/insights?q=%E8%8F%9C%E5%8D%95", "/sitemap.xml"];
const latencies = [];
const statuses = {};
let next = 0;

function load(route) {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const req = request(new URL(route, baseUrl), { rejectUnauthorized: false }, (response) => {
      response.resume();
      response.on("end", () => {
        const status = String(response.statusCode);
        statuses[status] = (statuses[status] ?? 0) + 1;
        latencies.push(performance.now() - started);
        if (response.statusCode !== 200) reject(new Error(`${route} returned ${status}`));
        else resolve();
      });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => req.destroy(new Error(`${route} timed out`)));
    req.end();
  });
}

async function worker() {
  while (next < total) {
    const index = next++;
    await load(routes[index % routes.length]);
  }
}

const started = performance.now();
await Promise.all(Array.from({ length: concurrency }, worker));
latencies.sort((a, b) => a - b);
const report = {
  total,
  concurrency,
  statuses,
  durationMs: Math.round(performance.now() - started),
  averageMs: Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length),
  p95Ms: Math.round(latencies[Math.floor(latencies.length * 0.95)]),
  maxMs: Math.round(latencies.at(-1)),
};
await mkdir(path.join(process.cwd(), "reports"), { recursive: true });
await writeFile(
  path.join(process.cwd(), "reports", "load-check.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
