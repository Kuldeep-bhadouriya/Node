import { auth } from "@node/auth";
import prisma from "@node/db";
import { env } from "@node/env/server";
import { type NextRequest, NextResponse } from "next/server";
import { generateQRToken } from "@/lib/qr-token";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const branch = request.nextUrl.searchParams.get("branch");

  if (!branch) {
    return NextResponse.json({ error: "Branch parameter required" }, { status: 400 });
  }

  const students = await prisma.student.findMany({
    where: { branch },
    orderBy: { cardNo: "asc" },
  });

  const baseUrl = env.BASE_URL;

  const result = students.map((student) => {
    const token = generateQRToken(student.id);
    return {
      cardNo: student.cardNo,
      name: student.name,
      profileUrl: `${baseUrl}/student/${student.id}?token=${encodeURIComponent(token.token)}`,
    };
  });

  return NextResponse.json(result);
}
