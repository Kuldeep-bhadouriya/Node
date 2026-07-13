import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../index";

export const studentRouter = router({
  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findUnique({
        where: { id: input.id },
      });

      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student profile not found",
        });
      }

      return student;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        rollNo: z.string().min(1),
        course: z.string().min(1),
        semester: z.number().min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.student.create({
        data: {
          name: input.name,
          rollNo: input.rollNo,
          course: input.course,
          semester: input.semester,
        },
      });
    }),
});
