import fs from 'fs';

const csvData = fs.readFileSync('CSV/CY.csv', 'utf-8');
const lines = csvData.split('\r\n');

const headers = lines[0].split(',');
const students = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  // Parse CSV properly handling quoted fields
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of lines[i]) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  const cardNoFull = values[0] || '';
  const name = values[1] || '';
  const batch = values[2] || '';
  const branch = values[3] || '';
  const fathersName = values[4] || '';
  const mothersName = values[5] || '';
  const address = values[6] || '';
  const studentMobile = values[7] || '';
  const parentsMobile = values[8] || '';
  const bloodGroup = values[9] || '';
  
  // Extract short card number (last 2 digits)
  const cardNoMatch = cardNoFull.match(/(\d+)$/);
  const cardNo = 'CY' + (cardNoMatch ? cardNoMatch[1].padStart(2, '0') : '');
  
  // Find matching photo
  const photoFiles = fs.readdirSync('apps/web/public/CY');
  const matchingPhoto = photoFiles.find(f => {
    const photoMatch = f.match(/CY\s*(\d+)\s+.+\.(jpg|jpeg|png)$/i);
    if (photoMatch) {
      const photoNum = photoMatch[1].padStart(2, '0');
      return photoNum === cardNo.replace('CY', '');
    }
    return false;
  });
  
  const photoPath = matchingPhoto ? '/CY/' + matchingPhoto : null;
  
  students.push({
    cardNo,
    cardNoFull,
    name: name.toUpperCase(),
    batch,
    branch: 'CY',
    fathersName,
    mothersName,
    address,
    studentMobile,
    parentsMobile,
    bloodGroup: bloodGroup.replace(' ', ''),
    photoPath
  });
}

console.log('Processed ' + students.length + ' students');

fs.writeFileSync('CSV/CY-data.json', JSON.stringify(students, null, 2));
console.log('Saved to CSV/CY-data.json');

// Show first student as example
console.log('\nFirst student:');
console.log(JSON.stringify(students[0], null, 2));
