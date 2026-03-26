import { writeFileSync, readFileSync, existsSync, unlinkSync, readdirSync, statSync, mkdirSync } from "fs";
import { join } from "path";

// File-based image store — works on Vercel serverless (/tmp)
// and local dev (local .tmp-images directory)
const STORE_DIR = process.env.NODE_ENV === "production"
  ? "/tmp/pimienta-images"
  : join(process.cwd(), ".tmp-images");

const TTL_MS = 60 * 60 * 1000; // 1 hour

function ensureDir() {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function cleanup() {
  ensureDir();
  const now = Date.now();
  try {
    for (const file of readdirSync(STORE_DIR)) {
      const filePath = join(STORE_DIR, file);
      const stat = statSync(filePath);
      if (now - stat.mtimeMs > TTL_MS) {
        unlinkSync(filePath);
      }
    }
  } catch {
    // Ignore cleanup errors
  }
}

class ImageStore {
  set(id: string, base64: string): void {
    ensureDir();
    cleanup();
    writeFileSync(join(STORE_DIR, `${id}.b64`), base64);
  }

  get(id: string): string | undefined {
    const filePath = join(STORE_DIR, `${id}.b64`);
    if (!existsSync(filePath)) return undefined;

    const stat = statSync(filePath);
    if (Date.now() - stat.mtimeMs > TTL_MS) {
      unlinkSync(filePath);
      return undefined;
    }

    return readFileSync(filePath, "utf-8");
  }
}

export const imageStore = new ImageStore();
