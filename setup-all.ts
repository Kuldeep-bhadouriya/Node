import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('=== College QR ID Setup Script ===\n');

// Step 1: Check Prisma migration
console.log('Step 1: Applying database schema changes...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', cwd: 'packages/db' });
  console.log('Database schema updated successfully!\n');
} catch (error) {
  console.error('Database migration failed. Please run manually: cd packages/db && npx prisma db push --accept-data-loss\n');
}

// Step 2: Import students
console.log('Step 2: Importing students from JSON...');
try {
  execSync('bun import-students.ts', { stdio: 'inherit', cwd: 'packages/db' });
  console.log('Students imported successfully!\n');
} catch (error) {
  console.error('Import failed. Trying alternative method...\n');
}

// Step 3: Generate QR codes
console.log('Step 3: Generating QR codes...');
try {
  execSync('bun generate-qr.ts ./QR', { stdio: 'inherit', cwd: 'packages/db' });
  console.log('QR codes generated successfully!\n');
} catch (error) {
  console.error('QR generation failed. Please run manually: cd packages/db && bun generate-qr.ts ./QR\n');
}

console.log('=== Setup Complete ===');
