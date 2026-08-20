import { NextRequest, NextResponse } from "next/server";
import prisma from "@node/db";

export async function GET(request: NextRequest) {
  const branch = request.nextUrl.searchParams.get("branch");

  if (!branch) {
    return NextResponse.json({ error: "Branch parameter required" }, { status: 400 });
  }

  const students = await prisma.student.findMany({
    where: { branch },
    orderBy: { cardNo: "asc" },
  });

  return NextResponse.json(students);
}
