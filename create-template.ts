import fs from 'fs';
import path from 'path';

// This script creates a template JSON based on the photos in public/CY folder
// You'll need to fill in the missing data from your XLSX file

const photosDir = 'apps/web/public/CY';
const outputJson = 'CSV/CY-template.json';

// Read all photos
const photos = fs.readdirSync(photosDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

console.log('Found ' + photos.length + ' photos');

// Extract cardNo and name from filename pattern: "CY {number} {name}.jpg"
const students = [];
for (const photo of photos) {
  const match = photo.match(/CY\s*(\d+)\s+(.+)\.(jpg|jpeg|png)$/i);
  if (match) {
    const cardNo = 'CY' + match[1].padStart(2, '0');
    const name = match[2].trim();
    const photoPath = '/CY/' + photo;
    
    students.push({
      cardNo,
      name,
      batch: '',
      branch: 'CY',
      fathersName: '',
      mothersName: '',
      address: '',
      studentMobile: '',
      parentsMobile: '',
      bloodGroup: '',
      photoPath
    });
  }
}

console.log('Created template for ' + students.length + ' students');

// Write template
fs.writeFileSync(outputJson, JSON.stringify(students, null, 2));
console.log('Template saved to ' + outputJson);
console.log('');
console.log('Please fill in the missing fields from your XLSX file:');
console.log('- batch');
console.log('- fathersName');
console.log('- mothersName');
console.log('- address');
console.log('- studentMobile');
console.log('- parentsMobile');
console.log('- bloodGroup');
