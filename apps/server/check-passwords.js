const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPasswords() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, email: true, firstName: true, lastName: true, password: true, isActive: true }
    });

    console.log('🔐 STUDENT PASSWORDS:');
    console.log('═══════════════════════════════════════');
    
    users.forEach(user => {
      console.log(`📧 ${user.email}`);
      console.log(`👤 ${user.firstName} ${user.lastName}`);
      console.log(`🔑 Password: ${user.password.substring(0, 20)}...`);
      console.log(`✅ Active: ${user.isActive}`);
      console.log('───────────────────────────────────────');
    });

    // Test if any password is plain text "password123"
    const plainTextUser = users.find(u => u.password === 'password123');
    if (plainTextUser) {
      console.log(`\n🎯 PLAIN TEXT PASSWORD FOUND: ${plainTextUser.email}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPasswords();
