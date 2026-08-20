const XLSX = require('xlsx');
const path = require('path');

const xlsxPath = path.resolve('CSV/CY.xlsx');
console.log('Reading:', xlsxPath);

const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log('Columns:', Object.keys(data[0] || {}));
console.log('Rows:', data.length);
console.log('\nFirst row:', JSON.stringify(data[0], null, 2));
