import { config } from 'dotenv';
config();

import { PrismaService } from './prisma/prisma.service';
import { seedPerfectData } from './seed-perfect';
import { seedLibraryInventoryData } from './seed-library-inventory';
import { seedSimpleAcademicData } from './seed-simple-academic';
import { seedProfessorSchedules } from './seed-professor-schedules';
import { seedGradeEntryData } from './seed-grade-entry-data';

async function main() {
  const prisma = new PrismaService();
  
  try {
    console.log('Starting COMPREHENSIVE database seeding...');
    
    // Step 1: Basic academic structure
    console.log('Step 1: Creating basic academic structure...');
    const basicResults = await seedPerfectData();
    console.log('Basic structure completed:', basicResults);
    
        // Step 2: Library & Inventory
    console.log('Step 2: Creating Library & Inventory data...');
    const libraryInventoryResults = await seedLibraryInventoryData();
    console.log('Library & Inventory completed:', libraryInventoryResults);

    // Step 3: Academic Data (enrollments, courses, grades)
    console.log('Step 3: Creating Academic data (enrollments, courses, grades)...');
    const academicResults = await seedSimpleAcademicData();
    console.log('Academic data completed:', academicResults);

    // Step 4: Professor Schedules
    console.log('Step 4: Creating Professor schedules...');
    await seedProfessorSchedules();
    console.log('Professor schedules completed');

    // Step 5: Grade Entry Demo Data
    console.log('Step 5: Creating Grade Entry demo data...');
    const gradeEntryResults = await seedGradeEntryData();
    console.log('Grade Entry demo data completed:', gradeEntryResults);

    console.log('COMPREHENSIVE database seeding completed successfully!');
    console.log('Final results:', {
      ...basicResults,
      ...libraryInventoryResults,
      ...academicResults
    });
    
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
