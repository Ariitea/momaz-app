import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:4173";
const OUTPUT_DIR = path.resolve(process.cwd(), "docs/evidence/MOM-228");
const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "390x844", width: 390, height: 844 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until timeout.
    }
    await sleep(500);
  }
  throw new Error(`Timed out waiting for dev server at ${url}`);
}

async function captureEvidence() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const devServer = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  devServer.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForServer(`${BASE_URL}/`);
    const browser = await chromium.launch();
    const evidence = [];

    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      await page.goto(`${BASE_URL}/?evidence=1`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);

      const s08Scene = page.locator("#scene-4");
      await s08Scene.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await s08Scene.screenshot({
        path: path.join(OUTPUT_DIR, `s08-safe-zone-${viewport.name}.png`),
      });

      await page.locator("#scene-4 a[href='#tailored-redesign']").click();
      await page.waitForFunction(() => window.location.hash === "#tailored-redesign");
      await page.waitForTimeout(250);

      const tailoredRedesign = page.locator("#tailored-redesign");
      await tailoredRedesign.screenshot({
        path: path.join(OUTPUT_DIR, `tailored-redesign-${viewport.name}.png`),
      });

      const sceneData = await page.evaluate(() => {
        return [...document.querySelectorAll("[data-scene-step]")].map((scene) => {
          const image = scene.querySelector("img");
          const safeZone = scene.querySelector("[data-safe-zone]");
          return {
            step: scene.getAttribute("data-scene-step"),
            objectPosition: image?.style.objectPosition ?? null,
            safeZoneMode: safeZone?.getAttribute("data-safe-zone-mode") ?? null,
            safeZoneStyle: safeZone
              ? {
                  left: safeZone.style.left,
                  top: safeZone.style.top,
                  width: safeZone.style.width,
                  height: safeZone.style.height,
                }
              : null,
          };
        });
      });

      evidence.push({
        viewport,
        capturedAt: new Date().toISOString(),
        sceneData,
      });

      await context.close();
    }

    await browser.close();
    await writeFile(
      path.join(OUTPUT_DIR, "viewport-safe-zone-evidence.json"),
      `${JSON.stringify({ baseUrl: BASE_URL, evidence }, null, 2)}\n`,
      "utf8",
    );
  } finally {
    devServer.kill("SIGTERM");
    await sleep(400);
    if (!devServer.killed) {
      devServer.kill("SIGKILL");
    }
  }

  if (stderr.trim()) {
    process.stderr.write(stderr);
  }
}

captureEvidence().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
