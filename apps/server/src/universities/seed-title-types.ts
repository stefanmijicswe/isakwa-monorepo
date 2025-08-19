import { PrismaService } from '../prisma/prisma.service';

export async function seedTitleTypes(prisma: PrismaService) {
  console.log('Seeding title types...');
  
  const titleTypes = [
    { name: 'Asistent' },
    { name: 'Docent' },
    { name: 'Vanredni profesor' },
    { name: 'Redovni profesor' },
    { name: 'Akademik' },
    { name: 'Doktor nauka' },
    { name: 'Magistar' },
  ];

  for (const titleType of titleTypes) {
    await prisma.titleType.upsert({
      where: { name: titleType.name },
      update: {},
      create: titleType,
    });
  }

  console.log('Title types seeded successfully!');
}
