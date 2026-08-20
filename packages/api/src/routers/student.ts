import { TRPCError } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
  getAllStudents,
  getBranches,
  getStudentByCardNo,
  getStudentById,
  getStudentsByBranch,
  STUDENTS_TAG,
} from "../data/students";
import { adminProcedure, publicProcedure, router } from "../index";

export const studentRouter = router({
  byId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const student = await getStudentById(input.id);

    if (!student) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student profile not found",
      });
    }

    return student;
  }),

  byCardNo: adminProcedure.input(z.object({ cardNo: z.string() })).query(async ({ input }) => {
    const student = await getStudentByCardNo(input.cardNo);

    if (!student) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student profile not found",
      });
    }

    return student;
  }),

  getAll: adminProcedure.query(async () => {
    return await getAllStudents();
  }),

  getByBranch: adminProcedure.input(z.object({ branch: z.string() })).query(async ({ input }) => {
    return await getStudentsByBranch(input.branch);
  }),

  getBranches: adminProcedure.query(async () => {
    return await getBranches();
  }),

  create: adminProcedure
    .input(
      z.object({
        cardNo: z.string().min(1),
        name: z.string().min(1),
        batch: z.string().min(1),
        branch: z.string().min(1),
        course: z.string().min(1),
        fathersName: z.string().min(1),
        mothersName: z.string().min(1),
        address: z.string().min(1),
        studentMobile: z.string().min(1),
        parentsMobile: z.string().min(1),
        bloodGroup: z.string().min(1),
        photoPath: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.create({
        data: {
          cardNo: input.cardNo,
          name: input.name,
          batch: input.batch,
          branch: input.branch,
          course: input.course,
          fathersName: input.fathersName,
          mothersName: input.mothersName,
          address: input.address,
          studentMobile: input.studentMobile,
          parentsMobile: input.parentsMobile,
          bloodGroup: input.bloodGroup,
          photoPath: input.photoPath,
        },
      });
      revalidateTag(STUDENTS_TAG, "max");
      return student;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        cardNo: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        batch: z.string().min(1).optional(),
        branch: z.string().min(1).optional(),
        course: z.string().min(1).optional(),
        fathersName: z.string().min(1).optional(),
        mothersName: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        studentMobile: z.string().min(1).optional(),
        parentsMobile: z.string().min(1).optional(),
        bloodGroup: z.string().min(1).optional(),
        photoPath: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const student = await ctx.prisma.student.update({
        where: { id },
        data,
      });
      revalidateTag(STUDENTS_TAG, "max");
      return student;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.delete({
        where: { id: input.id },
      });
      revalidateTag(STUDENTS_TAG, "max");
      return student;
    }),
});
