import prisma from "@node/db";
import { unstable_cache } from "next/cache";

export const STUDENTS_TAG = "students";

const CACHE_REVALIDATE = 300;

export const getStudentById = unstable_cache(
  async (id: string) => prisma.student.findUnique({ where: { id } }),
  ["student-by-id"],
  { revalidate: CACHE_REVALIDATE, tags: [STUDENTS_TAG] },
);

export const getStudentByCardNo = unstable_cache(
  async (cardNo: string) => prisma.student.findUnique({ where: { cardNo } }),
  ["student-by-card-no"],
  { revalidate: CACHE_REVALIDATE, tags: [STUDENTS_TAG] },
);

export const getAllStudents = unstable_cache(
  async () => prisma.student.findMany({ orderBy: { createdAt: "desc" } }),
  ["students-all"],
  { revalidate: CACHE_REVALIDATE, tags: [STUDENTS_TAG] },
);

export const getStudentsByBranch = unstable_cache(
  async (branch: string) =>
    prisma.student.findMany({ where: { branch }, orderBy: { cardNo: "asc" } }),
  ["students-by-branch"],
  { revalidate: CACHE_REVALIDATE, tags: [STUDENTS_TAG] },
);

export const getBranches = unstable_cache(
  async () => {
    const students = await prisma.student.findMany({ select: { branch: true } });
    return [...new Set(students.map((s) => s.branch))].sort();
  },
  ["student-branches"],
  { revalidate: CACHE_REVALIDATE, tags: [STUDENTS_TAG] },
);

export const getBranchCounts = unstable_cache(
  async () => prisma.student.groupBy({ by: ["branch"], _count: true }),
  ["student-branch-counts"],
  { revalidate: CACHE_REVALIDATE, tags: [STUDENTS_TAG] },
);
