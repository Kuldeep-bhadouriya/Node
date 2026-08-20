# College QR ID - Student Management System

## Features

- **Student ID Cards**: Digital identity cards for students with QR verification
- **CSV Import**: Bulk import student data from CSV files
- **Mass QR Download**: Generate QR codes organized by branch folders
- **Local Photo Storage**: Store student photos locally and display on ID cards

## Database Schema

The Student model includes the following fields:

- cardNo - Unique card number (e.g., CY001)
- 
ame - Student name
- atch - Batch year (e.g., 2024)
- ranch - Branch code (e.g., CY, CS, EC)
- athersName - Father's name
- mothersName - Mother's name
- ddress - Student address
- studentMobile - Student's mobile number
- parentsMobile - Parent's mobile number
- loodGroup - Blood group (e.g., O+, A+, B+)
- photoPath - Local photo path (e.g., /students/CY/CY001.jpg)

## CSV Import

### CSV Format

Create a CSV file with the following columns:

`csv
cardNo,name,batch,branch,fathersName,mothersName,address,studentMobile,parentsMobile,bloodGroup,photoPath
CY001,John Doe,2024,CY,Robert Doe,Mary Doe,123 Main Street,9876543210,9123456780,O+,/students/CY/CY001.jpg
`

### Import Command

Run the import script from the packages/db directory:

`ash
cd packages/db
npx tsx prisma/import-students.ts <path-to-csv-file>
`

Example:
`ash
npx tsx prisma/import-students.ts prisma/sample-students.csv
`

## Mass QR Code Generation

Generate QR codes for all students organized by branch:

`ash
cd packages/db
npx tsx scripts/generate-qr.ts [output-directory]
`

Default output directory is ./qr-codes. QR codes are saved as JPEG images in branch folders:

`
qr-codes/
├── CY/
│   ├── CY001.jpg
│   ├── CY002.jpg
│   └── ...
├── CS/
│   ├── CS001.jpg
│   └── ...
└── EC/
    └── ...
`

### Environment Variables Required

Make sure QR_TOKEN_SECRET and BASE_URL are set in your .env file:

`nv
QR_TOKEN_SECRET=your-secret-key-here
BASE_URL=https://your-domain.com
`

## Photo Storage

Store student photos in the public folder:

`
public/
└── students/
    ├── CY/
    │   ├── CY001.jpg
    │   └── CY002.jpg
    ├── CS/
    │   └── CS001.jpg
    └── ...
`

Set the photoPath field to the public path (e.g., /students/CY/CY001.jpg) when importing or creating students.

## Admin Pages

- /admin - Admin dashboard to manage students
- /admin/download - Download QR codes by branch
- /admin/generate - View and print QR codes

## API Endpoints

- GET /api/students/by-branch?branch=<branch> - Get students by branch
- tRPC router: student.byId, student.getAll, student.getByBranch, student.create, etc.
