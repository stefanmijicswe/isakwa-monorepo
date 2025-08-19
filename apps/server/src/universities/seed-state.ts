import { PrismaService } from '../prisma/prisma.service';

export async function seedState(prisma: PrismaService) {
  console.log('Seeding states...');
  
  const states = [
    { name: 'Srbija' },
    { name: 'Crna Gora' },
    { name: 'Bosna i Hercegovina' },
    { name: 'Hrvatska' },
    { name: 'Slovenija' },
    { name: 'Severna Makedonija' },
    { name: 'Kosovo' },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { name: state.name },
      update: {},
      create: state,
    });
  }

  console.log('States seeded successfully!');
}
