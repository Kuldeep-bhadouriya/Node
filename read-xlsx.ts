// Use bun to read and parse XLSX
import { readFileSync, writeFileSync } from 'fs';

// Read the XLSX file as buffer
const xlsxBuffer = readFileSync('CSV/CY.xlsx');

// Use the xlsx package via bun's import
const XLSX = await import('xlsx').then(m => m.default || m);

const wb = XLSX.read(xlsxBuffer);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log('Columns:', Object.keys(data[0] || {}));
console.log('Rows:', data.length);
console.log('\nFirst 3 rows:');
console.log(JSON.stringify(data.slice(0, 3), null, 2));

// Save to JSON for later use
writeFileSync('CSV/CY-data.json', JSON.stringify(data, null, 2));
console.log('\nSaved to CSV/CY-data.json');
