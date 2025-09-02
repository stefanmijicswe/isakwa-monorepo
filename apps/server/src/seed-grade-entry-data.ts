import { PrismaService } from './prisma/prisma.service';

export async function seedGradeEntryData() {
  const prisma = new PrismaService();
  
  console.log('🎓 Starting Grade Entry seeding...');

  try {
    // First, ensure we have professor john.smith
    let professor = await prisma.user.findUnique({
      where: { email: 'john.smith@isakwa.edu' },
      include: { professorProfile: true }
    });

    if (!professor) {
      // Find or create department first
      let department = await prisma.department.findFirst({
        where: { name: 'Computer Science' }
      });

      if (!department) {
        // Find faculty first for department
        let faculty = await prisma.faculty.findFirst({
          where: { name: 'Faculty of Information Technologies' }
        });

        if (!faculty) {
          // Need to find university first
          let university = await prisma.university.findFirst();
          if (!university) {
            university = await prisma.university.create({
              data: {
                name: 'Harvox University',
                description: 'Leading university in technology and innovation'
              }
            });
          }

          faculty = await prisma.faculty.create({
            data: {
              universityId: university.id,
              name: 'Faculty of Information Technologies',
              description: 'Faculty of Information Technologies offering cutting-edge programs',
              phone: '+381 34 336 223',
              email: 'info@fit.kg.ac.rs',
              deanName: 'Prof. Dr. Milan Stevovic',
              deanTitle: 'Dean'
            }
          });
        }

        department = await prisma.department.create({
          data: {
            name: 'Computer Science',
            description: 'Department of Computer Science',
            facultyId: faculty.id,
            isActive: true
          }
        });
      }

      // Create professor if doesn't exist
      const bcrypt = await import('bcryptjs');
      professor = await prisma.user.create({
        data: {
          email: 'john.smith@isakwa.edu',
          password: await bcrypt.hash('professor123', 10),
          firstName: 'John',
          lastName: 'Smith',
          role: 'PROFESSOR',
          isActive: true,
          professorProfile: {
            create: {
              departmentId: department.id,
              title: 'Associate Professor',
              phoneNumber: '+381-11-234-5678',
              officeRoom: 'CS-201',
              jmbg: '1234567890123'
            }
          }
        },
        include: { professorProfile: true }
      });
    }

    // Faculty should already exist from above

    // Find or create study program
    let studyProgram = await prisma.studyProgram.findFirst({
      where: { name: 'Software Engineering' }
    });

    if (!studyProgram) {
      // Get faculty again
      let faculty = await prisma.faculty.findFirst({
        where: { name: 'Faculty of Information Technologies' }
      });

      // If faculty doesn't exist, use any existing faculty
      if (!faculty) {
        faculty = await prisma.faculty.findFirst();
        if (!faculty) {
          throw new Error('No faculty found in database');
        }
      }

      studyProgram = await prisma.studyProgram.create({
        data: {
          name: 'Software Engineering',
          code: 'SE',
          level: 'BACHELOR',
          duration: 8,
          description: 'Bachelor program in Software Engineering',
          facultyId: faculty.id,
          directorName: 'Prof. Dr. Ana Petrovic',
          directorTitle: 'Program Director'
        }
      });
    }

    // Create subjects with consistent naming matching frontend
    const subjects = [
      {
        name: 'Introduction to Information Technologies',
        code: 'IT101',
        description: 'Fundamentals of information technologies and computer science',
        credits: 6,
        ects: 6,
        semester: 1,
        daysAgo: 3 // 12 days remaining
      },
      {
        name: 'Programming Fundamentals',
        code: 'PF102', 
        description: 'Basic programming concepts and algorithms',
        credits: 8,
        ects: 8,
        semester: 1,
        daysAgo: 8 // 7 days remaining
      },
      {
        name: 'Web Technologies',
        code: 'WT202',
        description: 'Modern web development technologies and frameworks',
        credits: 6,
        ects: 6,
        semester: 2,
        daysAgo: 1 // 14 days remaining
      },
      {
        name: 'Database Systems',
        code: 'DB301',
        description: 'Database design, implementation and management',
        credits: 7,
        ects: 7,
        semester: 3,
        daysAgo: 12 // 3 days remaining
      },
      {
        name: 'Software Engineering',
        code: 'SE401',
        description: 'Software development methodologies and project management',
        credits: 8,
        ects: 8,
        semester: 4,
        daysAgo: 6 // 9 days remaining
      }
    ];

    // Create or update subjects
    const createdSubjects = [];
    for (const subjectData of subjects) {
      let subject = await prisma.subject.findUnique({
        where: { code: subjectData.code }
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: {
            name: subjectData.name,
            code: subjectData.code,
            description: subjectData.description,
            credits: subjectData.credits,
            ects: subjectData.ects,
            semester: subjectData.semester,
            mandatory: true,
            numberOfLectures: 30,
            numberOfExercises: 30,
            studyProgramId: studyProgram.id,
          }
        });
      }

      createdSubjects.push({ ...subject, daysAgo: subjectData.daysAgo });
    }

    // Create exam period for current semester
    const currentDate = new Date();
    const examPeriodStart = new Date(currentDate.getTime() - (20 * 24 * 60 * 60 * 1000)); // 20 days ago
    const examPeriodEnd = new Date(currentDate.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 days from now
    
    let examPeriod = await prisma.examPeriod.findFirst({
      where: {
        name: 'Winter 2024 Exam Period',
        academicYear: '2023/2024'
      }
    });

    if (!examPeriod) {
      examPeriod = await prisma.examPeriod.create({
        data: {
          name: 'Winter 2024 Exam Period',
          startDate: examPeriodStart,
          endDate: examPeriodEnd,
          registrationStartDate: new Date(examPeriodStart.getTime() - (10 * 24 * 60 * 60 * 1000)),
          registrationEndDate: new Date(examPeriodStart.getTime() + (5 * 24 * 60 * 60 * 1000)),
          academicYear: '2023/2024',
          semesterType: 'WINTER',
          isActive: true
        }
      });
    }

    // Create exams with fixed dates based on daysAgo
    const createdExams = [];
    for (const subject of createdSubjects) {
      // Check if exam already exists
      let exam = await prisma.exam.findFirst({
        where: {
          subjectId: subject.id,
          examPeriodId: examPeriod.id
        }
      });

      if (!exam) {
        const examDate = new Date(currentDate.getTime() - (subject.daysAgo * 24 * 60 * 60 * 1000));
        
        exam = await prisma.exam.create({
          data: {
            subjectId: subject.id,
            examPeriodId: examPeriod.id,
            examDate: examDate,
            examTime: '09:00',
            startTime: '09:00',
            endTime: '11:00',
            location: 'Amphitheater 1',
            status: 'COMPLETED',
            maxPoints: 100,
            duration: 120,
            isActive: true
          }
        });
      }

      createdExams.push(exam);
    }

    // Create professor assignments for these subjects
    for (const subject of createdSubjects) {
      const existingAssignment = await prisma.professorAssignment.findFirst({
        where: {
          professorId: professor.id,
          subjectId: subject.id
        }
      });

      if (!existingAssignment) {
        await prisma.professorAssignment.create({
          data: {
            professorId: professor.id,
            subjectId: subject.id,
            academicYear: '2023/2024',
            teachingType: 'LECTURE',
            isActive: true
          }
        });
      }
    }

    console.log('✅ Grade Entry seeding completed successfully!');
    
    return {
      professor: professor.firstName + ' ' + professor.lastName,
      subjects: createdSubjects.length,
      exams: createdExams.length,
      examPeriod: examPeriod.name
    };

  } catch (error) {
    console.error('❌ Error during Grade Entry seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// If run directly
if (require.main === module) {
  seedGradeEntryData()
    .then(result => {
      console.log('🎉 Grade Entry seeding result:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Grade Entry seeding failed:', error);
      process.exit(1);
    });
}
