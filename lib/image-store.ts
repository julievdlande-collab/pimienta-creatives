// Temporary in-memory image store
// Replace with Supabase Storage for production
const MAX_IMAGES = 100;
const TTL_MS = 60 * 60 * 1000; // 1 hour

interface StoredImage {
  data: string; // base64
  createdAt: number;
}

class ImageStore {
  private store = new Map<string, StoredImage>();

  set(id: string, base64: string): void {
    // Evict expired entries
    this.cleanup();

    // Evict oldest if at capacity
    if (this.store.size >= MAX_IMAGES) {
      const oldest = this.store.keys().next().value;
      if (oldest) this.store.delete(oldest);
    }

    this.store.set(id, { data: base64, createdAt: Date.now() });
  }

  get(id: string): string | undefined {
    const entry = this.store.get(id);
    if (!entry) return undefined;
    if (Date.now() - entry.createdAt > TTL_MS) {
      this.store.delete(id);
      return undefined;
    }
    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, entry] of this.store) {
      if (now - entry.createdAt > TTL_MS) {
        this.store.delete(id);
      }
    }
  }
}

export const imageStore = new ImageStore();
