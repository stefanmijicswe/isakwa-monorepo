import { config } from 'dotenv';
config(); 

import { PrismaService } from './prisma/prisma.service';
import { seedState } from './universities/seed-state';
import { seedTitleTypes } from './universities/seed-title-types';
import { seedScientificFields } from './universities/seed-scientific-fields';
import { seedUniversity } from './universities/seed-university';
import { seedStudyPrograms } from './study-programs/seed-study-programs';
import { seedSubjects } from './subjects/seed-subjects';
import { seedAcademicRecords } from './academic-records/seed-academic-records';
import { seedSyllabus } from './academic-records/seed-syllabus';
import { seedCourseSchedules } from './academic-records/seed-course-schedules';
import { seedEvaluationInstruments } from './evaluation-instruments/seed-evaluation-instruments';
import { seedNotifications } from './academic-records/seed-notifications';
import { seedStudentAnalytics } from './academic-records/seed-student-analytics';
import { seedLibrary } from './library/seed-library';
import { seedInventory } from './inventory/seed-inventory';
import { seedUsers } from './users/seed-users';

async function main() {
  const prisma = new PrismaService();
  
  try {
    console.log('Starting database seeding...');
    
    await seedState(prisma);
    await seedTitleTypes(prisma);
    await seedScientificFields(prisma);
    await seedUniversity(prisma);
    await seedStudyPrograms(prisma);
    await seedSubjects(prisma);
    await seedUsers(prisma);
    await seedAcademicRecords(prisma);
    await seedSyllabus(prisma);
    await seedCourseSchedules(prisma);
    await seedEvaluationInstruments(prisma);
    await seedNotifications(prisma);
    await seedStudentAnalytics(prisma);
    await seedLibrary(prisma);
    await seedInventory(prisma);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
