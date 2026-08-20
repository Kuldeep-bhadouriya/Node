import XLSX from 'xlsx';
import path from 'path';

const xlsxPath = path.resolve('../../CSV/CY.xlsx');
console.log('Reading XLSX from:', xlsxPath);

const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log('Columns:', Object.keys(data[0] || {}));
console.log('Row count:', data.length);
console.log('\nFirst 3 rows:');
console.log(JSON.stringify(data.slice(0, 3), null, 2));
