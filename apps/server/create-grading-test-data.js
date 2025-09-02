const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createGradingTestData() {
  try {
    console.log('🎓 Creating grading test data for professor ID 26...');

    // Check if professor 26 exists
    const professor = await prisma.user.findUnique({
      where: { id: 26 },
      include: { professorProfile: true }
    });

    if (!professor) {
      console.log('❌ Professor ID 26 not found, exiting...');
      return;
    }

    console.log('✅ Found professor:', professor.firstName, professor.lastName);

    // Get existing subjects
    const subjects = await prisma.subject.findMany({
      take: 2 // Get first 2 subjects
    });

    console.log('📚 Found subjects:', subjects.map(s => s.name));

    // Assign professor to these subjects
    for (const subject of subjects) {
      // Check if assignment already exists
      const existingAssignment = await prisma.professorAssignment.findFirst({
        where: {
          professorId: 26,
          subjectId: subject.id,
          studyProgramId: 1,
          academicYear: '2024/2025'
        }
      });

      if (!existingAssignment) {
        await prisma.professorAssignment.create({
          data: {
            professorId: 26,
            subjectId: subject.id,
            studyProgramId: 1,
            academicYear: '2024/2025',
            teachingType: 'LECTURES',
            isActive: true
          }
        });
      } else {
        await prisma.professorAssignment.update({
          where: { id: existingAssignment.id },
          data: { isActive: true }
        });
      }
    }

    console.log('👨‍🏫 Assigned professor to subjects');

    // Create exam period for current date
    const currentDate = new Date();
    let examPeriod = await prisma.examPeriod.findFirst({
      where: { name: 'Test Period 2024/2025' }
    });

    if (!examPeriod) {
      examPeriod = await prisma.examPeriod.create({
        data: {
          name: 'Test Period 2024/2025',
          startDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          endDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          registrationStartDate: new Date(currentDate.getTime() - 45 * 24 * 60 * 60 * 1000),
          registrationEndDate: new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000),
          academicYear: '2024/2025',
          isActive: true
        }
      });
    }

    console.log('📅 Created exam period:', examPeriod.name);

    // Create exams for the subjects with recent dates
    const exams = [];
    for (const subject of subjects) {
      const exam = await prisma.exam.create({
        data: {
          subjectId: subject.id,
          examPeriodId: examPeriod.id,
          examDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (within 15 day deadline)
          startTime: '09:00:00',
          endTime: '12:00:00',
          location: 'Room 101',
          type: 'WRITTEN',
          maxPoints: 100,
          passingPoints: 51,
          isActive: true
        }
      });
      exams.push(exam);
    }

    console.log('📝 Created exams:', exams.length);

    // Get student users
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { studentProfile: true }
    });

    console.log('👨‍🎓 Found students:', students.length);

    // Create exam registrations
    const registrations = [];
    for (const exam of exams) {
      for (const student of students) {
        const registration = await prisma.examRegistration.create({
          data: {
            studentId: student.id,
            subjectId: exam.subjectId,
            examId: exam.id,
            isActive: true
          }
        });
        registrations.push(registration);
      }
    }

    console.log('✍️ Created exam registrations:', registrations.length);

    console.log('🎉 Grading test data created successfully!');
    console.log('📊 Summary:');
    console.log(`  - Professor assignments: ${subjects.length}`);
    console.log(`  - Exam period: 1`);
    console.log(`  - Exams: ${exams.length}`);
    console.log(`  - Exam registrations: ${registrations.length}`);

  } catch (error) {
    console.error('❌ Error creating grading test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createGradingTestData();
