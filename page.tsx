import { appRouter } from "@node/api/routers/index";
import prisma from "@node/db";
import { notFound } from "next/navigation";
import { DigitalIdCard } from "@/components/DigitalIdCard";
import { verifyQRToken } from "@/lib/qr-token";

export const revalidate = 60; // Next.js ISR: Revalidate edge cache every 60 seconds

export default async function StudentProfilePage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  // Validate token - must be present and valid
  if (!searchParams.token || !verifyQRToken(params.id, searchParams.token)) {
    notFound();
  }
  
  try {
    // Create a server-side caller for the tRPC router
    // We pass a minimal context since the byId query is a publicProcedure
    const caller = appRouter.createCaller({
      session: null,
      prisma: prisma,
    });

    const student = await caller.student.byId({ id: params.id });

    return <DigitalIdCard student={student} />;
  } catch (error) {
    // If tRPC throws NOT_FOUND or validation fails
    notFound();
  }
}
