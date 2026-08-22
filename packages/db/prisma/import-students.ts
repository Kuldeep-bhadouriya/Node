import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../apps/web/.env") });
const { default: prisma } = await import("../src/index.js");

interface StudentCSV {
  cardNo: string;
  name: string;
  batch: string;
  branch: string;
  course?: string;
  fathersName: string;
  mothersName: string;
  address: string;
  studentMobile: string;
  parentsMobile: string;
  bloodGroup: string;
  photoPath?: string;
}

function parseCSV(contents: string): StudentCSV[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < contents.length; index++) {
    const character = contents[index];
    const nextCharacter = contents[index + 1];
    if (character === '"' && quoted && nextCharacter === '"') {
      field += '"';
      index++;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index++;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field.trim());
    rows.push(row);
  }

  const headers = rows.shift()?.map(normalizeHeader) ?? [];
  return rows.map((values) => {
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    return {
      cardNo: record.cardno,
      name: record.name,
      batch: record.batch,
      branch: record.branch,
      course: record.course || "btech",
      fathersName: record.fathersname,
      mothersName: record.mothersname,
      address: record.address || record.adderss,
      studentMobile: record.studentsmobileno,
      parentsMobile: record.parentsmobileno,
      bloodGroup: record.bloodgroup,
      photoPath: record.photopath,
    };
  });
}

function normalizeHeader(header: string) {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getBranchCode(student: StudentCSV) {
  return student.branch.match(/\(([^)]+)\)/)?.[1] || student.cardNo.split("/").find((part) => /^[A-Z]{2,3}$/i.test(part)) || student.branch.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function getCardNumber(student: StudentCSV) {
  return student.cardNo.split("/").at(-1) || student.cardNo;
}

function copyLegacyPhoto(branchCode: string, student: StudentCSV, photoPath: string, rowNumber: number) {
  const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../apps/web/public");
  const target = path.join(publicDir, photoPath.replace(/^\//, ""));
  if (fs.existsSync(target)) return;

  const sourceDirs = [
    path.join(publicDir, branchCode),
    path.join(publicDir, "Scan Student Photo DS"),
  ];
  const sourceDir = sourceDirs.find((directory) => fs.existsSync(directory));
  if (!sourceDir) return;
  const cardNumber = Number(getCardNumber(student));
  const legacyPhoto = fs.readdirSync(sourceDir).find((file) =>
    new RegExp(`^${branchCode} (?:${cardNumber}|${rowNumber})(?:[ .]|$)`, "i").test(file)
  );
  if (!legacyPhoto) return;

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(sourceDir, legacyPhoto), target);
}

async function importStudentsFromCSV(csvFilePath: string) {
  console.log(`Reading CSV file: ${csvFilePath}`);
  const records = parseCSV(fs.readFileSync(csvFilePath, "utf8"));
  console.log(`Found ${records.length} records in CSV`);

  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const [index, record] of records.entries()) {
    try {
      const existing = await prisma.student.findUnique({ where: { cardNo: record.cardNo } });
      const branchCode = getBranchCode(record);
      const photoPath = record.photoPath || `/students/${branchCode}/${getCardNumber(record)}.jpg`;
      copyLegacyPhoto(branchCode, record, photoPath, index + 1);
      const data = {
        cardNo: record.cardNo,
        name: record.name,
        batch: record.batch,
        branch: record.branch,
        course: record.course || "btech",
        fathersName: record.fathersName,
        mothersName: record.mothersName,
        address: record.address,
        studentMobile: record.studentMobile,
        parentsMobile: record.parentsMobile,
        bloodGroup: record.bloodGroup,
        photoPath,
      };

      await prisma.student.upsert({ where: { cardNo: record.cardNo }, create: data, update: data });
      if (existing) updated++;
      else imported++;
      console.log(`${existing ? "Updated" : "Imported"}: ${record.cardNo} - ${record.name}`);
    } catch (error) {
      console.error(`Error importing ${record.cardNo}:`, error);
      errors++;
    }
  }

  const branchNames = [...new Set(records.map((record) => record.branch))];
  const cardNumbers = records.map((record) => record.cardNo);
  const removed = await prisma.student.deleteMany({
    where: {
      branch: { in: branchNames },
      cardNo: { notIn: cardNumbers },
    },
  });

  console.log("\n--- Import Summary ---");
  console.log(`Imported: ${imported}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`Removed stale records: ${removed.count}`);
  console.log(`Total processed: ${records.length}`);
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const csvPathArgument = process.argv[2] || "CSV/CY.csv";
const csvPath = path.isAbsolute(csvPathArgument) ? csvPathArgument : path.resolve(repoRoot, csvPathArgument);
if (!fs.existsSync(csvPath)) {
  console.error(`File not found: ${csvPath}`);
  process.exit(1);
}

importStudentsFromCSV(csvPath)
  .catch((error) => {
    console.error("Import failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
