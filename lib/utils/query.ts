import prisma from "../db";
import { CacheStrategy } from "../types";

export const createAndGetQuote = async (strategy?: CacheStrategy) => {
  const createdData = await prisma.quotes.create({
    data: {
      quote: `This is a quote - Random Number: ${Math.floor(
        Math.random() * 100000 + 100000
      )}`,
    },
  });

  const result = await prisma.quotes
    .findUnique({
      where: { id: createdData.id },
      cacheStrategy: {
        ...strategy,
        tags: ["quote_by_id"],
      },
    })
    .withAccelerateInfo();

  return result;
};

export const getQuoteById = async (id: number, strategy?: CacheStrategy) => {
  const result = await prisma.quotes
    .findUnique({
      where: { id: id },
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
