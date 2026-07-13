import prisma from "../src/index";

async function main() {
  console.log("Seeding fake students...");

  // Clear existing students to avoid unique constraint errors if re-run
  await prisma.student.deleteMany({});

  const students = [
    { name: "Alice Johnson", rollNo: "CS2023-001", course: "Computer Science", semester: 4, photoUrl: "https://i.pravatar.cc/300?img=1" },
    { name: "Bob Smith", rollNo: "ME2023-014", course: "Mechanical Engineering", semester: 4, photoUrl: "https://i.pravatar.cc/300?img=11" },
    { name: "Charlie Davis", rollNo: "EE2022-042", course: "Electrical Engineering", semester: 6, photoUrl: "https://i.pravatar.cc/300?img=60" },
    { name: "Diana Prince", rollNo: "CS2024-105", course: "Computer Science", semester: 2, photoUrl: "https://i.pravatar.cc/300?img=5" },
    { name: "Ethan Hunt", rollNo: "CE2021-022", course: "Civil Engineering", semester: 8, photoUrl: "https://i.pravatar.cc/300?img=8" },
    { name: "Fiona Gallagher", rollNo: "BT2023-033", course: "Biotechnology", semester: 4, photoUrl: "https://i.pravatar.cc/300?img=9" },
    { name: "George Miller", rollNo: "CS2022-099", course: "Computer Science", semester: 6, photoUrl: "https://i.pravatar.cc/300?img=13" },
    { name: "Hannah Abbott", rollNo: "EE2024-005", course: "Electrical Engineering", semester: 2, photoUrl: "https://i.pravatar.cc/300?img=16" },
    { name: "Ian Wright", rollNo: "ME2021-087", course: "Mechanical Engineering", semester: 8, photoUrl: "https://i.pravatar.cc/300?img=15" },
    { name: "Julia Roberts", rollNo: "BT2022-011", course: "Biotechnology", semester: 6, photoUrl: "https://i.pravatar.cc/300?img=20" },
    { name: "Kevin Hart", rollNo: "CE2023-045", course: "Civil Engineering", semester: 4, photoUrl: "https://i.pravatar.cc/300?img=33" },
    { name: "Laura Croft", rollNo: "CS2021-002", course: "Computer Science", semester: 8, photoUrl: "https://i.pravatar.cc/300?img=44" },
    { name: "Michael Scott", rollNo: "EE2023-066", course: "Electrical Engineering", semester: 4, photoUrl: "https://i.pravatar.cc/300?img=51" },
    { name: "Nina Williams", rollNo: "ME2024-030", course: "Mechanical Engineering", semester: 2, photoUrl: "https://i.pravatar.cc/300?img=49" },
    { name: "Oliver Twist", rollNo: "BT2021-078", course: "Biotechnology", semester: 8, photoUrl: "https://i.pravatar.cc/300?img=53" },
  ];

  for (const s of students) {
    const created = await prisma.student.create({ data: s });
    console.log(`Created student: ${created.name} (${created.id})`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
