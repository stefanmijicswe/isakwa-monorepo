const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database content...');
    
    const countries = await prisma.country.count();
    console.log(`📍 Countries: ${countries}`);
    
    const universities = await prisma.university.count();
    console.log(`🏛️ Universities: ${universities}`);
    
    const faculties = await prisma.faculty.count();
    console.log(`🏫 Faculties: ${faculties}`);
    
    const studyPrograms = await prisma.studyProgram.count();
    console.log(`🎓 Study Programs: ${studyPrograms}`);
    
    const subjects = await prisma.subject.count();
    console.log(`📚 Subjects: ${subjects}`);
    
    const users = await prisma.user.count();
    console.log(`👥 Users: ${users}`);
    
    const libraryItems = await prisma.libraryItem.count();
    console.log(`📖 Library Items: ${libraryItems}`);
    
    const libraryBorrowings = await prisma.libraryBorrowing.count();
    console.log(`📝 Library Borrowings: ${libraryBorrowings}`);
    
    const inventoryItems = await prisma.inventoryItem.count();
    console.log(`📦 Inventory Items: ${inventoryItems}`);
    
    const inventoryIssuances = await prisma.inventoryIssuance.count();
    console.log(`📤 Inventory Issuances: ${inventoryIssuances}`);
    
    const inventoryRequests = await prisma.inventoryRequest.count();
    console.log(`📋 Inventory Requests: ${inventoryRequests}`);
    
    if (faculties > 0) {
      console.log('\n📋 Faculty details:');
      const facultyList = await prisma.faculty.findMany({
        select: {
          id: true,
          name: true,
          universityId: true
        }
      });
      console.table(facultyList);
    }
    
    if (libraryItems > 0) {
      console.log('\n📖 Library Items:');
      const libraryList = await prisma.libraryItem.findMany({
        select: {
          id: true,
          title: true,
          author: true,
          type: true,
          available: true,
          totalCopies: true
        }
      });
      console.table(libraryList);
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
