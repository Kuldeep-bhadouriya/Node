import fs from 'fs';
import prisma from './src/index.js';

interface StudentData {
  cardNo: string;
  cardNoFull: string;
  name: string;
  batch: string;
  branch: string;
  fathersName: string;
  mothersName: string;
  address: string;
  studentMobile: string;
  parentsMobile: string;
  bloodGroup: string;
  photoPath: string | null;
}

async function importStudents(jsonPath: string) {
  console.log('Importing students from:', jsonPath);
  
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const students: StudentData[] = JSON.parse(rawData);
  
  console.log('Found', students.length, 'students to import');
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const student of students) {
    try {
      const existing = await prisma.student.findUnique({
        where: { cardNo: student.cardNo },
      });
      
      if (existing) {
        console.log('Skipping', student.cardNo, '- already exists');
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
          photoPath: student.photoPath,
        },
      });
      
      console.log('Imported:', student.cardNo, '-', student.name);
      imported++;
    } catch (error) {
      console.error('Error importing', student.cardNo, ':', error);
      errors++;
    }
  }
  
  console.log('\n--- Import Summary ---');
  console.log('Imported:', imported);
  console.log('Skipped:', skipped);
  console.log('Errors:', errors);
  
  await prisma['']();
}

const jsonPath = process.argv[2] || '../CSV/CY-data.json';
importStudents(jsonPath);
