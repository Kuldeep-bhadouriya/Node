import { appRouter } from "@node/api/routers/index";
import prisma from "@node/db";
import { notFound } from "next/navigation";
import { DigitalIdCard } from "@/components/DigitalIdCard";

export const revalidate = 60; // Next.js ISR: Revalidate edge cache every 60 seconds

export default async function StudentProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
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
