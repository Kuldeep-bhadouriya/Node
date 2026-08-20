import { createHmac, randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import prisma from "./src/index.js";

function generateQRToken(studentId: string, secret: string): string {
  const random = randomBytes(16).toString("hex");
  const timestamp = Date.now();

  const signature = createHmac("sha256", secret)
    .update(studentId + ":" + random + ":" + timestamp)
    .digest("hex");

  return random + ":" + timestamp + ":" + signature;
}

async function generateQRCodes(outputDir: string) {
  console.log("Generating QR codes to:", outputDir);

  const qrTokenSecret = process.env.QR_TOKEN_SECRET;
  if (!qrTokenSecret) {
    console.error("ERROR: QR_TOKEN_SECRET environment variable is required");
    process.exit(1);
  }

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    console.error("ERROR: BASE_URL environment variable is required");
    process.exit(1);
  }
  console.log("Base URL:", baseUrl);

  const students = await prisma.student.findMany({
    orderBy: [{ branch: "asc" }, { cardNo: "asc" }],
  });

  if (students.length === 0) {
    console.log("No students found in database.");
    await prisma.$disconnect();
    return;
  }

  console.log("Found", students.length, "students");

  // Group by branch
  const branchMap = new Map<string, typeof students>();
  for (const student of students) {
    const branchStudents = branchMap.get(student.branch) || [];
    branchStudents.push(student);
    branchMap.set(student.branch, branchStudents);
  }

  const baseDir = path.resolve(outputDir);
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Dynamic import for QRCode
  const QRCode = (await import("qrcode")).default;

  let totalGenerated = 0;
  let errors = 0;

  for (const [branch, branchStudents] of branchMap) {
    const branchCode =
      branchStudents[0].cardNo.split("/")[2] ||
      branch.match(/\(([^)]+)\)/)?.[1] ||
      branch.replace(/[^a-z0-9]/gi, "").toUpperCase();
    const branchDir = path.join(baseDir, branchCode);
    if (!fs.existsSync(branchDir)) {
      fs.mkdirSync(branchDir, { recursive: true });
    }

    console.log("\nProcessing branch: " + branch + " (" + branchStudents.length + " students)");

    for (const student of branchStudents) {
      try {
        const qrToken = generateQRToken(student.id, qrTokenSecret);
        const profileUrl =
          baseUrl + "/student/" + student.id + "?token=" + encodeURIComponent(qrToken);

        const qrBuffer = await QRCode.toBuffer(profileUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        // Save with cardNo as filename
        const cardNumber =
          student.cardNo.split("/").at(-1) || student.cardNo.replace(/[^a-z0-9]/gi, "_");
        const fileName = cardNumber + ".png";
        const filePath = path.join(branchDir, fileName);
        fs.writeFileSync(filePath, qrBuffer);

        console.log("  Generated: " + fileName + " (" + student.name + ")");
        totalGenerated++;
      } catch (error) {
        console.error("  Error generating QR for " + student.cardNo + ":", error);
        errors++;
      }
    }
  }

  console.log("\n--- Generation Summary ---");
  console.log("Total QR codes generated:", totalGenerated);
  console.log("Errors:", errors);
  console.log("Output directory:", baseDir);

  await prisma.$disconnect();
}

const outputDir = process.argv[2] || "../QR";
generateQRCodes(outputDir);
