const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 TESTING AUTH SYSTEM...');
    console.log('═══════════════════════════════════════');

    // 1. Check if student1@isakwa.edu exists
    const student1 = await prisma.user.findFirst({
      where: { email: 'student1@isakwa.edu' }
    });

    if (!student1) {
      console.log('❌ student1@isakwa.edu NOT FOUND in database');
      return;
    }

    console.log('✅ student1@isakwa.edu FOUND:');
    console.log(`   👤 Name: ${student1.firstName} ${student1.lastName}`);
    console.log(`   🔑 Role: ${student1.role}`);
    console.log(`   ✅ Active: ${student1.isActive}`);
    console.log(`   🔐 Password Hash: ${student1.password.substring(0, 30)}...`);

    // 2. Test password validation manually
    console.log('\n🔐 TESTING PASSWORD VALIDATION...');
    const testPassword = 'password123';
    const isValid = await bcrypt.compare(testPassword, student1.password);
    
    console.log(`   Testing password: "${testPassword}"`);
    console.log(`   Hash in DB: ${student1.password.substring(0, 30)}...`);
    console.log(`   ✅ Password Valid: ${isValid}`);

    if (!isValid) {
      console.log('❌ PASSWORD MISMATCH! This is the problem.');
      
      // Let's create a fresh hash and compare
      console.log('\n🔧 CREATING FRESH HASH FOR COMPARISON...');
      const freshHash = await bcrypt.hash('password123', 10);
      console.log(`   Fresh hash: ${freshHash.substring(0, 30)}...`);
      console.log(`   DB hash:    ${student1.password.substring(0, 30)}...`);
      
      const freshTest = await bcrypt.compare('password123', freshHash);
      console.log(`   Fresh hash works: ${freshTest}`);
    }

    // 3. Check all students
    console.log('\n👥 ALL STUDENTS IN DATABASE:');
    const allStudents = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { email: true, firstName: true, lastName: true, isActive: true }
    });

    allStudents.forEach(s => {
      console.log(`   📧 ${s.email} | ${s.firstName} ${s.lastName} | Active: ${s.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
