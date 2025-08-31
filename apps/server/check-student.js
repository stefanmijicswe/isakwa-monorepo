const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStudent() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'test@test.com' },
      include: { 
        studentProfile: {
          include: {
            studyProgram: { select: { name: true, code: true } },
            courseEnrollments: {
              include: {
                subject: { select: { name: true, code: true, credits: true } }
              }
            }
          }
        }
      }
    });

    console.log('👤 STUDENT USER:');
    console.log('═══════════════════════════════════════');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.firstName} ${user.lastName}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`✅ Active: ${user.isActive}`);
    
    if (user.studentProfile) {
      console.log('\n📝 STUDENT PROFILE:');
      console.log(`📋 Index: ${user.studentProfile.studentIndex}`);
      console.log(`🎓 Year: ${user.studentProfile.year}`);
      console.log(`📞 Phone: ${user.studentProfile.phoneNumber}`);
      console.log(`📅 Enrollment Year: ${user.studentProfile.enrollmentYear}`);
      
      if (user.studentProfile.studyProgram) {
        console.log(`🎓 Study Program: ${user.studentProfile.studyProgram.name} (${user.studentProfile.studyProgram.code})`);
      }
      
      console.log(`\n📚 ENROLLED COURSES: ${user.studentProfile.courseEnrollments.length}`);
      user.studentProfile.courseEnrollments.forEach(enrollment => {
        console.log(`   - ${enrollment.subject.name} (${enrollment.subject.code}) - ${enrollment.subject.credits} ECTS`);
      });
    } else {
      console.log('\n❌ NO STUDENT PROFILE FOUND');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudent();
