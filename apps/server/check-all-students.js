const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllStudents() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { 
        studentProfile: {
          include: {
            studyProgram: { select: { name: true, code: true } }
          }
        }
      }
    });

    console.log('👥 SVI STUDENTI U BAZI:');
    console.log('═══════════════════════════════════════');
    
    students.forEach(student => {
      console.log(`📧 ${student.email}`);
      console.log(`👤 ${student.firstName} ${student.lastName}`);
      console.log(`📋 Profile: ${student.studentProfile ? '✅' : '❌'}`);
      
      if (student.studentProfile) {
        console.log(`   📋 Index: ${student.studentProfile.studentIndex}`);
        console.log(`   🎓 Program: ${student.studentProfile.studyProgram?.name || 'N/A'}`);
      }
      console.log('───────────────────────────────────────');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllStudents();
