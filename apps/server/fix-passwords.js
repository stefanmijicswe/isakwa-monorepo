const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixPasswords() {
  try {
    console.log('🔧 FIXING ALL STUDENT PASSWORDS...');
    console.log('═══════════════════════════════════════');

    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log(`🔐 Generated hash: ${hashedPassword.substring(0, 30)}...`);

    // Update all students with plain text passwords
    const studentsToFix = [
      'student1@isakwa.edu',
      'student2@isakwa.edu', 
      'test@test.com'
    ];

    for (const email of studentsToFix) {
      console.log(`\n🔄 Updating ${email}...`);
      
      const result = await prisma.user.update({
        where: { email: email },
        data: { password: hashedPassword }
      });
      
      console.log(`✅ Updated user ID: ${result.id}`);
    }

    // Verify the fix
    console.log('\n✅ VERIFICATION:');
    for (const email of studentsToFix) {
      const user = await prisma.user.findFirst({
        where: { email: email }
      });
      
      if (user) {
        const isValid = await bcrypt.compare('password123', user.password);
        console.log(`📧 ${email}: Password valid = ${isValid}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();
