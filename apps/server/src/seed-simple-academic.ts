import { config } from 'dotenv';
config();

import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaService();

async function seedSimpleAcademicData() {
  console.log('🎓 Starting SIMPLE academic data seeding...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Get existing departments
    console.log('🏢 Getting existing departments...');
    
    const csDept = await prisma.department.findFirst({
      where: { name: { contains: 'Computer Science' } }
    });

    const mathDept = await prisma.department.findFirst({
      where: { name: { contains: 'Management' } }
    });

    if (!csDept || !mathDept) {
      throw new Error('Required departments not found! Run basic seed first.');
    }

    // 2. Create professors
    console.log('👨‍🏫 Creating professors...');
    
    const prof1 = await prisma.user.upsert({
      where: { email: 'prof.nikolic@isakwa.edu' },
      update: { password: hashedPassword },
      create: {
        email: 'prof.nikolic@isakwa.edu',
        password: hashedPassword,
        firstName: 'Petar',
        lastName: 'Nikolić',
        role: 'PROFESSOR',
        isActive: true
      }
    });

    const prof2 = await prisma.user.upsert({
      where: { email: 'prof.jovanovic@isakwa.edu' },
      update: { password: hashedPassword },
      create: {
        email: 'prof.jovanovic@isakwa.edu',
        password: hashedPassword,
        firstName: 'Milica',
        lastName: 'Jovanović',
        role: 'PROFESSOR',
        isActive: true
      }
    });

    // Create professor profiles
    await prisma.professorProfile.upsert({
      where: { userId: prof1.id },
      update: {},
      create: {
        userId: prof1.id,
        departmentId: csDept.id,
        title: 'Associate Professor',
        phoneNumber: '+381 21 485 2111',
        officeRoom: 'CS-201',
        jmbg: '1234567890111'
      }
    });

    await prisma.professorProfile.upsert({
      where: { userId: prof2.id },
      update: {},
      create: {
        userId: prof2.id,
        departmentId: mathDept.id,
        title: 'Full Professor',
        phoneNumber: '+381 21 485 2112',
        officeRoom: 'M-301',
        jmbg: '1234567890112'
      }
    });

    // 3. Get existing students
    console.log('👨‍🎓 Getting existing students...');
    
    const student1 = await prisma.user.findFirst({ where: { email: 'student1@isakwa.edu' } });
    const student2 = await prisma.user.findFirst({ where: { email: 'student2@isakwa.edu' } });

    if (!student1 || !student2) {
      throw new Error('Students not found! Run basic seed first.');
    }

    // 4. Create student enrollments in study programs
    console.log('📝 Creating student enrollments...');
    
    await prisma.studentEnrollment.create({
      data: {
        studentId: student1.id, // User ID, not StudentProfile ID
        studyProgramId: 1, // Bachelor of Computer Science
        academicYear: '2024/2025',
        year: 3,
        status: 'ACTIVE'
      }
    });

    await prisma.studentEnrollment.create({
      data: {
        studentId: student2.id, // User ID, not StudentProfile ID
        studyProgramId: 2, // Bachelor of Business Administration
        academicYear: '2024/2025',
        year: 2,
        status: 'ACTIVE'
      }
    });

    // 5. Assign professors to subjects
    console.log('📚 Assigning professors to subjects...');
    
    await prisma.professorAssignment.create({
      data: {
        professorId: prof1.id,
        subjectId: 1,
        studyProgramId: 1,
        academicYear: '2024/2025',
        teachingType: 'LECTURE',
        isActive: true
      }
    });

    await prisma.professorAssignment.create({
      data: {
        professorId: prof2.id,
        subjectId: 2,
        studyProgramId: 1,
        academicYear: '2024/2025',
        teachingType: 'LECTURE',
        isActive: true
      }
    });

    // 6. Enroll students in courses (subjects)
    console.log('📖 Enrolling students in courses...');
    
    await prisma.courseEnrollment.create({
      data: {
        studentId: student1.id,
        subjectId: 1,
        academicYear: '2024/2025',
        isActive: true
      }
    });

    await prisma.courseEnrollment.create({
      data: {
        studentId: student1.id,
        subjectId: 2,
        academicYear: '2024/2025',
        isActive: true
      }
    });

    // Enroll student2 in business course
    await prisma.courseEnrollment.create({
      data: {
        studentId: student2.id,
        subjectId: 3,
        academicYear: '2024/2025',
        isActive: true
      }
    });

    // 7. Create exam periods
    console.log('📅 Creating exam periods...');
    
    const examPeriod = await prisma.examPeriod.create({
      data: {
        name: 'January 2025',
        academicYear: '2024/2025',
        semesterType: 'WINTER',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-30'),
        registrationStartDate: new Date('2025-01-01'),
        registrationEndDate: new Date('2025-01-10'),
        isActive: true
      }
    });

    // 8. Create exams
    console.log('📝 Creating exams...');
    
    const exam1 = await prisma.exam.create({
      data: {
        subjectId: 1,
        examPeriodId: examPeriod.id,
        examDate: new Date('2025-01-20'),
        examTime: '10:00',
        startTime: '10:00',
        endTime: '12:00',
        duration: 120,
        location: 'Amphitheater A',
        maxPoints: 100,
        status: 'ACTIVE'
      }
    });

    const exam2 = await prisma.exam.create({
      data: {
        subjectId: 2,
        examPeriodId: examPeriod.id,
        examDate: new Date('2025-01-22'),
        examTime: '14:00',
        startTime: '14:00',
        endTime: '17:00',
        duration: 180,
        location: 'Room 201',
        maxPoints: 100,
        status: 'ACTIVE'
      }
    });

    // 9. Register students for exams
    console.log('✍️ Registering students for exams...');
    
    await prisma.examRegistration.create({
      data: {
        studentId: student1.id,
        examId: exam1.id,
        subjectId: 1,
        isActive: true
      }
    });

    await prisma.examRegistration.create({
      data: {
        studentId: student1.id,
        examId: exam2.id,
        subjectId: 2,
        isActive: true
      }
    });

    // 10. Create some past grades
    console.log('🏆 Creating past grades...');
    
    // Create a past exam period
    const pastExamPeriod = await prisma.examPeriod.create({
      data: {
        name: 'September 2024',
        academicYear: '2023/2024',
        semesterType: 'SUMMER',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-15'),
        registrationStartDate: new Date('2024-08-15'),
        registrationEndDate: new Date('2024-08-30'),
        isActive: false
      }
    });

    const pastExam = await prisma.exam.create({
      data: {
        subjectId: 1,
        examPeriodId: pastExamPeriod.id,
        examDate: new Date('2024-09-10'),
        examTime: '10:00',
        startTime: '10:00',
        endTime: '12:00',
        duration: 120,
        location: 'Amphitheater A',
        maxPoints: 100,
        status: 'COMPLETED'
      }
    });

    // Create grade
    await prisma.grade.create({
      data: {
        studentId: student1.id,
        examId: pastExam.id,
        subjectId: 1,
        points: 85,
        grade: 9,
        passed: true,
        gradedAt: new Date('2024-09-15'),
        gradedBy: prof1.id
      }
    });

    console.log('✅ Simple academic data seed completed successfully!');
    
    return {
      departments: 2,
      professors: 2,
      studentEnrollments: 2,
      courseEnrollments: 3,
      examPeriods: 2,
      exams: 3,
      examRegistrations: 2,
      grades: 1
    };

  } catch (error) {
    console.error('❌ Error during simple academic seeding:', error);
    throw error;
  }
}

export { seedSimpleAcademicData };
