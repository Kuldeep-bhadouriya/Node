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
    
  byCardNo: publicProcedure
    .input(z.object({ cardNo: z.string() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findUnique({
        where: { cardNo: input.cardNo },
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
  
  getByBranch: publicProcedure
    .input(z.object({ branch: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.student.findMany({
        where: { branch: input.branch },
        orderBy: { cardNo: "asc" },
      });
    }),
    
  getBranches: publicProcedure.query(async ({ ctx }) => {
    const students = await ctx.prisma.student.findMany({
      select: { branch: true },
    });
    const branches = [...new Set(students.map((s) => s.branch))];
    return branches.sort();
  }),

  create: publicProcedure
    .input(
      z.object({
        cardNo: z.string().min(1),
        name: z.string().min(1),
        batch: z.string().min(1),
        branch: z.string().min(1),
        fathersName: z.string().min(1),
        mothersName: z.string().min(1),
        address: z.string().min(1),
        studentMobile: z.string().min(1),
        parentsMobile: z.string().min(1),
        bloodGroup: z.string().min(1),
        photoPath: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.student.create({
        data: {
          cardNo: input.cardNo,
          name: input.name,
          batch: input.batch,
          branch: input.branch,
          fathersName: input.fathersName,
          mothersName: input.mothersName,
          address: input.address,
          studentMobile: input.studentMobile,
          parentsMobile: input.parentsMobile,
          bloodGroup: input.bloodGroup,
          photoPath: input.photoPath,
        },
      });
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        cardNo: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        batch: z.string().min(1).optional(),
        branch: z.string().min(1).optional(),
        fathersName: z.string().min(1).optional(),
        mothersName: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        studentMobile: z.string().min(1).optional(),
        parentsMobile: z.string().min(1).optional(),
        bloodGroup: z.string().min(1).optional(),
        photoPath: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.student.update({
        where: { id },
        data,
      });
    }),
    
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.student.delete({
        where: { id: input.id },
      });
    }),
});
