import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { createHmac, randomBytes } from "crypto";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../apps/web/.env") });
const { default: prisma } = await import("../src/index.js");

const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function generateQRToken(studentId: string, secret: string) {
  const random = randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const token = createHmac("sha256", secret)
    .update(`${studentId}:${random}:${timestamp}`)
    .digest("hex");
  return `${random}:${timestamp}:${token}`;
}

function getBranchCode(branch: string, cardNo: string) {
  return cardNo.split("/")[2] || branch.match(/\(([^)]+)\)/)?.[1] || branch.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function getCardNumber(cardNo: string) {
  return cardNo.split("/").at(-1) || cardNo.replace(/[^a-z0-9]/gi, "_");
}

async function generateQRCodes(outputDir = "./QR") {
  const secret = process.env.QR_TOKEN_SECRET;
  if (!secret) throw new Error("QR_TOKEN_SECRET environment variable is required");

  const students = await prisma.student.findMany({ orderBy: [{ branch: "asc" }, { cardNo: "asc" }] });
  const baseUrl = process.env.BASE_URL || "http://localhost:3001";
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
  const baseDir = path.isAbsolute(outputDir) ? outputDir : path.resolve(repoRoot, outputDir);
  fs.mkdirSync(baseDir, { recursive: true });

  for (const student of students) {
    const branchCode = getBranchCode(student.branch, student.cardNo);
    const branchDir = path.join(baseDir, branchCode);
    fs.mkdirSync(branchDir, { recursive: true });
    const token = generateQRToken(student.id, secret);
    const profileUrl = `${baseUrl}/student/${student.id}?token=${encodeURIComponent(token)}`;
    const filePath = path.join(branchDir, `${getCardNumber(student.cardNo)}.png`);
    await QRCode.toFile(filePath, profileUrl, { width: 400, margin: 2 });
    console.log(`Generated ${branchCode}/${path.basename(filePath)} for ${student.name}`);
  }

  console.log(`Generated ${students.length} QR codes in ${baseDir}`);
}

generateQRCodes(process.argv[2])
  .catch((error) => {
    console.error("QR generation failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
