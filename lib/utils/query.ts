import prisma from "../db";
import { CacheStrategy } from "../types";

export const getQuoteById = async (id: number, strategy?: CacheStrategy) => {
  const result = await prisma.quotes
    .findUnique({
      where: { id },
      cacheStrategy: {
        ...strategy,
        tags: ["quote_by_id"],
      },
    })
    .withAccelerateInfo();

  return result;
};

// Update quote by specific ID
export const updateQuoteById = async (id: number, newQuote: string) => {
  return await prisma.quotes.update({
    where: { id },
    data: { quote: newQuote },
  });
};

// Invalidate cache using the tag for specific quotes
export const invalidateCache = async () => {
  try {
    await prisma.$accelerate.invalidate({
      tags: ["quote_by_id"],
    });
    console.log("Cache invalidated for quote with ID 1");
  } catch (e: any) {
    if (e.code === "P6003") {
      console.log(
        "Cache invalidation rate limit reached. Please try again shortly."
      );
    }
    throw e;
  }
};
