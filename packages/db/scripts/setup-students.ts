import fs from 'fs';
import path from 'path';
import prisma from './index.js';
import { createHmac, randomBytes } from 'crypto';

const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateQRToken(studentId: string, secret: string): { token: string; expiresAt: number } {
  const random = randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const expiresAt = timestamp + TOKEN_EXPIRY_MS;
  
  const signature = createHmac('sha256', secret)
    .update(${studentId}::)
    .digest('hex');
  
  return {
    token: ${random}::,
    expiresAt,
  };
}

interface StudentData {
  cardNo: string;
  name: string;
  batch: string;
  branch: string;
  fathersName: string;
  mothersName: string;
  address: string;
  studentMobile: string;
  parentsMobile: string;
  bloodGroup: string;
  photoPath?: string;
}

async function importFromJSON(jsonPath: string) {
  console.log('Importing students from JSON:', jsonPath);
  
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const students: StudentData[] = JSON.parse(rawData);
  
  console.log(Found  students to import);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const student of students) {
    try {
      const existing = await prisma.student.findUnique({
        where: { cardNo: student.cardNo },
      });
      
      if (existing) {
        console.log(Skipping  - already exists);
        skipped++;
        continue;
      }
      
      await prisma.student.create({
        data: {
          cardNo: student.cardNo,
          name: student.name,
          batch: student.batch,
          branch: student.branch,
          fathersName: student.fathersName,
          mothersName: student.mothersName,
          address: student.address,
          studentMobile: student.studentMobile,
          parentsMobile: student.parentsMobile,
          bloodGroup: student.bloodGroup,
          photoPath: student.photoPath || null,
        },
      });
      
      console.log(Imported:  - );
      imported++;
    } catch (error) {
      console.error(Error importing :, error);
      errors++;
    }
  }
  
  console.log('\n--- Import Summary ---');
  console.log(Imported: );
  console.log(Skipped: );
  console.log(Errors: );
  
  await prisma.\();
}

async function generateQRCodes(outputDir: string = './QR') {
  console.log('Generating QR codes...');
  
  const qrTokenSecret = process.env.QR_TOKEN_SECRET;
  if (!qrTokenSecret) {
    console.error('ERROR: QR_TOKEN_SECRET environment variable is required');
    process.exit(1);
  }

  const students = await prisma.student.findMany({
    orderBy: [{ branch: 'asc' }, { cardNo: 'asc' }],
  });

  if (students.length === 0) {
    console.log('No students found in database.');
    return;
  }

  console.log(Found  students);

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

  let totalGenerated = 0;
  let errors = 0;

  // Dynamic import for QRCode
  const QRCode = (await import('qrcode')).default;

  for (const [branch, branchStudents] of branchMap) {
    const branchDir = path.join(baseDir, branch);
    if (!fs.existsSync(branchDir)) {
      fs.mkdirSync(branchDir, { recursive: true });
    }

    console.log(\nProcessing branch:  ( students));

    for (const student of branchStudents) {
      try {
        const qrToken = generateQRToken(student.id, qrTokenSecret);
        const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
        const profileUrl = ${baseUrl}/student/?token=;

        const qrBuffer = await QRCode.toBuffer(profileUrl, {
          type: 'jpeg',
          quality: 0.95,
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });

        // Save with cardNo as filename
        const fileName = ${student.cardNo}.jpg;
        const filePath = path.join(branchDir, fileName);
        fs.writeFileSync(filePath, qrBuffer);

        console.log(  Generated:  ());
        totalGenerated++;
      } catch (error) {
        console.error(  Error generating QR for :, error);
        errors++;
      }
    }
  }

  console.log('\n--- Generation Summary ---');
  console.log(Total QR codes generated: );
  console.log(Errors: );
  console.log(Output directory: );

  await prisma.\();
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'import') {
  const jsonPath = args[1] || 'CSV/CY-data.json';
  importFromJSON(jsonPath);
} else if (command === 'qr') {
  const outputDir = args[1] || './QR';
  generateQRCodes(outputDir);
} else {
  console.log('Usage:');
  console.log('  bun packages/db/scripts/setup-students.ts import <json-file>');
  console.log('  bun packages/db/scripts/setup-students.ts qr [output-dir]');
}
