import type { NextRequest } from "next/server";

import { auth } from "@node/auth";
import prisma from "@node/db";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export interface Context {
  session: Session;
  prisma: typeof prisma;
}

export async function createContext(req: NextRequest): Promise<Context> {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    session,
    prisma,
  };
}
