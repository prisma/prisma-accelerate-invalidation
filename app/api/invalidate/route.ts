import { invalidateCache } from "@/lib/utils/query";

export async function POST() {
  await invalidateCache();
  return new Response("Cache invalidated", { status: 200 });
}
