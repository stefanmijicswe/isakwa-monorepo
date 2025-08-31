const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getStudentProfileId() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'student1@isakwa.edu' },
      include: { studentProfile: true }
    });

    console.log('👤 User ID:', user.id);
    console.log('📋 StudentProfile ID:', user.studentProfile?.id || 'NONE');
    
    if (user.studentProfile) {
      console.log('✅ Student has profile');
      return user.studentProfile.id;
    } else {
      console.log('❌ Student has NO profile');
      return null;
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getStudentProfileId();
