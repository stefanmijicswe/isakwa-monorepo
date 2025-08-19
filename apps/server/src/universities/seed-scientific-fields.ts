import { PrismaService } from '../prisma/prisma.service';

export async function seedScientificFields(prisma: PrismaService) {
  console.log('Seeding scientific fields...');
  
  const scientificFields = [
    { name: 'Informatika i računarstvo' },
    { name: 'Matematika' },
    { name: 'Fizika' },
    { name: 'Hemija' },
    { name: 'Biologija' },
    { name: 'Ekonomija' },
    { name: 'Pravo' },
    { name: 'Medicina' },
    { name: 'Arhitektura' },
    { name: 'Mašinstvo' },
    { name: 'Elektrotehnika' },
    { name: 'Gradjevina' },
    { name: 'Turizam i hotelijerstvo' },
    { name: 'Filologija' },
    { name: 'Istorija' },
    { name: 'Filozofija' },
  ];

  for (const field of scientificFields) {
    await prisma.scientificField.upsert({
      where: { name: field.name },
      update: {},
      create: field,
    });
  }

  console.log('Scientific fields seeded successfully!');
}
