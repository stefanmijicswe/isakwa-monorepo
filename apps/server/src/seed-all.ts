import { config } from 'dotenv';
config(); 

import { PrismaService } from './prisma/prisma.service';
import { seedUniversity } from './universities/seed-university';
import { seedStudyPrograms } from './study-programs/seed-study-programs';
import { seedSubjects } from './subjects/seed-subjects';

async function main() {
  const prisma = new PrismaService();
  
  try {
    console.log('Starting database seeding...');
    
    await seedUniversity(prisma);
    await seedStudyPrograms(prisma);
    await seedSubjects(prisma);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
