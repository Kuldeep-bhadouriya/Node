# node

This file provides context about the project for AI assistants.

## Project Overview

- **Ecosystem**: TypeScript
- **Repo type**: Turborepo monorepo (managed with bun workspaces + package catalog)

## Tech Stack

- **Runtime**: Node.js (Next.js app deployed on Vercel)
- **Package Manager**: bun

### Frontend

- Framework: next (App Router)
- CSS: tailwind
- UI Library: shadcn-ui
- Client data fetching: @tanstack/react-query via tRPC

### Backend

- Framework: self (Next.js route handlers / server pages)
- API: trpc
- Validation: zod
- Caching: Next.js Data Cache (`unstable_cache` from `next/cache`) with tag-based revalidation

### Database

- Database: postgres
- ORM: prisma

### Authentication

- Provider: better-auth

### Additional Features

- Testing: vitest
- Linting/formatting: biome (`bun run check`)
- QR-verified digital ID cards with HMAC-signed, non-expiring tokens (`apps/web/src/lib/qr-token.ts`)

## Caching

- Student DB reads are wrapped in `unstable_cache` in `packages/api/src/data/students.ts` (tag `students`, revalidate 300s). On Vercel this uses the durable Data Cache shared across serverless instances.
- `create`/`update`/`delete` mutations in `packages/api/src/routers/student.ts` call `revalidateTag("students", "max")` to invalidate on writes.
- When adding new student queries or mutations, route them through `packages/api/src/data/students.ts` and reuse the `students` tag so invalidation stays consistent.

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

## Common Commands

- `bun install` - Install dependencies
- `bun dev` - Start development server (tRPC/web on port 3001)
- `bun build` - Build for production
- `bun test` - Run tests
- `bun check-types` - Type-check all workspaces
- `bun check` - Run Biome lint + format (auto-fixes with `--write`)
- `bun db:push` - Push database schema
- `bun db:studio` - Open database UI

## Maintenance

Keep AGENTS.md updated when:

- Adding/removing dependencies
- Changing project structure
- Adding new features or services
- Modifying build/dev workflows

AI assistants should suggest updates to this file when they notice relevant changes.