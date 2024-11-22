# Prisma Accelerate Cache Invalidation Test

This project demonstrates cache invalidation timing in a Next.js application using Prisma and Prisma Accelerate, with a Time-to-Live (TTL) strategy. It measures the time it takes for cache invalidation to reflect updated data.

## Application overview

The app provides an interactive interface to test cache invalidation behavior.

### How it works:
1. A quote is fetched with a TTL of 60 seconds.
2. The fetched quote is cached.
3. The quote is updated in the database.
4. The cache is invalidated using Prisma Accelerate's `$invalidate` API.
5. The app polls the API until the updated quote is fetched.
6. The total time for invalidation to take effect is displayed, including frontend-to-backend roundtrip delays.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Obtain an Accelerate API key from [Prisma Data Platform](https://pris.ly/pdp).
- Create a `.env` file in the project root directory with the following content:

```bash
# Accelerate connection string
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=ACCELERATE_API_KEY"

# To run migrations
DIRECT_URL="postgresql://username:password@host:5432/database_name"
```

## Getting Started

To get started with this project, follow these steps:

1. Install project dependencies:

```bash
npm install
```

2. Set up Prisma by running migrations and generating a PrismaClient for edge functions:

```bash
npx prisma migrate dev
npx prisma db seed
npx prisma generate --no-engine
```

3. Start the application:

```bash
npm run dev
```

The app will run at http://localhost:3000.

## How to Use

1.	Click the “Start cache invalidation test” button on the homepage.
2.	Observe the timeline for cache invalidation and updated data retrieval.
3.	Review the displayed total invalidation time.
