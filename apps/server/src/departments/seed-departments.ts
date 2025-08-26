import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding departments...');

  const departments = [
    { name: 'Computer Science', description: 'Computer Science and Information Technology' },
    { name: 'Mathematics', description: 'Mathematics and Statistics' },
    { name: 'Physics', description: 'Physics and Applied Sciences' },
    { name: 'Chemistry', description: 'Chemistry and Chemical Engineering' },
    { name: 'Biology', description: 'Biology and Life Sciences' },
    { name: 'Business Administration', description: 'Business and Management' },
    { name: 'Economics', description: 'Economics and Finance' },
    { name: 'Psychology', description: 'Psychology and Behavioral Sciences' },
    { name: 'Sociology', description: 'Sociology and Social Sciences' },
    { name: 'History', description: 'History and Humanities' },
    { name: 'Literature', description: 'Literature and Languages' },
    { name: 'Philosophy', description: 'Philosophy and Ethics' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
  }

  console.log('✅ Departments seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding departments:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
