const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      },
      orderBy: { role: 'asc' }
    });

    console.log('📧 SVI KORISNICI U BAZI:');
    console.log('═══════════════════════════════════════');
    
    users.forEach(user => {
      console.log(`${user.role.padEnd(15)} | ${user.email.padEnd(25)} | ${user.firstName} ${user.lastName} | Active: ${user.isActive}`);
    });
    
    console.log('═══════════════════════════════════════');
    console.log(`📊 UKUPNO: ${users.length} korisnika`);
    
    // Check students specifically
    const students = users.filter(u => u.role === 'STUDENT');
    console.log(`\n👨‍🎓 STUDENTI (${students.length}):`);
    students.forEach(s => {
      console.log(`   📧 ${s.email} | ${s.firstName} ${s.lastName}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
