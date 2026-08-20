# node

This project was created with [Better Fullstack](https://github.com/Marve10s/Better-Fullstack), a modern TypeScript stack that combines Next.js, Self, TRPC, and more. It's a QR-verified digital ID card system for college students, deployed on Vercel.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework (App Router)
- **TailwindCSS** - CSS framework
- **shadcn/ui** - UI components
- **tRPC** - End-to-end type-safe APIs
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better Auth
- **QR-verified ID cards** - HMAC-signed, non-expiring tokens per student (`apps/web/src/lib/qr-token.ts`)
- **Server-side caching** - Next.js Data Cache with tag-based revalidation for student data
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## Caching

- Student DB reads are wrapped in `unstable_cache` (`packages/api/src/data/students.ts`) using a shared `students` tag with a 300s revalidation window.
- `create`/`update`/`delete` mutations call `revalidateTag("students", "max")` so writes are reflected immediately.
- On Vercel this uses the durable Data Cache shared across serverless instances.
- The public `/student/[id]` page stays dynamically rendered (token check), but its DB query is cached.

## Git Hooks and Formatting

- Format and lint fix: `bun run check`

## Project Structure

```
node/
├── apps/
│   └── web/         # Next.js frontend + route handlers (tRPC, auth, by-branch API)
├── packages/
│   ├── api/         # tRPC routers + cached data-access layer (src/data/)
│   ├── auth/        # Better Auth configuration
│   ├── config/      # Shared TypeScript config
│   ├── db/          # Prisma schema, client, and seed/import scripts
│   └── env/         # Env validation (server/web/native)
```

## Available Scripts

- `bun run dev`: Start all applications in development mode (web on port 3001)
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Biome formatting and linting (auto-fixes with `--write`)