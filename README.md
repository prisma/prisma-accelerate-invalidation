# Accelerate Next.js Starter Project

This project demonstrates cache invalidation timing in a Next.js application using Prisma and Prisma Accelerate, with a Time-to-Live (TTL) strategy.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Obtain an Accelerate API key from [Prisma Data Platform](https://pris.ly/pdp).
- Create a `.env` file in the project root directory with the following content:

```bash
# Accelerate connection string
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=ACCELERATE_API_KEY"

# To run migrations
DIRECT_URL="postgresql://username:password@host:5432/database_name"

NEXT_PUBLIC_URL="http://localhost:3000"
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
npx prisma generate --no-engine
```

3. Start the application:

```bash
npm run dev
```
