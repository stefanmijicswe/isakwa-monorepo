import { config } from 'dotenv';
config();

import { PrismaService } from './prisma/prisma.service';
import { UserRole, StudentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaService();

export async function seedStudentSearchData() {
  console.log('🎓 Starting Student Search data seeding...');

  try {
    // Get or create faculties and study programs
    const faculties = [
      { name: 'Computer Science', code: 'CS' },
      { name: 'Mathematics', code: 'MATH' },
      { name: 'Physics', code: 'PHYS' },
      { name: 'Engineering', code: 'ENG' }
    ];

    const studyPrograms = [];

    // First, get the university (assuming it exists from previous seeds)
    let university = await prisma.university.findFirst();
    if (!university) {
      throw new Error('University not found. Please run basic seed first.');
    }

    // Create faculties and study programs
    for (const facultyData of faculties) {
      let faculty = await prisma.faculty.findFirst({
        where: { name: facultyData.name }
      });

      if (!faculty) {
        faculty = await prisma.faculty.create({
          data: {
            name: facultyData.name,
            universityId: university.id,
            description: `Faculty of ${facultyData.name}`,
          }
        });
      }

      // Create study program for each faculty
      let studyProgram = await prisma.studyProgram.findFirst({
        where: { name: facultyData.name }
      });

      if (!studyProgram) {
        studyProgram = await prisma.studyProgram.create({
          data: {
            name: facultyData.name,
            code: facultyData.code,
            level: 'Bachelor',
            duration: 4,
            facultyId: faculty.id,
            description: `Bachelor degree in ${facultyData.name}`
          }
        });
      }

      studyPrograms.push({ faculty: facultyData.name, studyProgram });
      console.log(`Faculty and Study Program created: ${facultyData.name}`);
    }

    // Create departments if they don't exist
    for (const facultyData of faculties) {
      const faculty = await prisma.faculty.findFirst({
        where: { name: facultyData.name }
      });

      let department = await prisma.department.findFirst({
        where: { name: facultyData.name }
      });

      if (!department) {
        department = await prisma.department.create({
          data: {
            name: facultyData.name,
            description: `Department of ${facultyData.name}`,
            facultyId: faculty?.id
          }
        });
        console.log(`Department created: ${facultyData.name}`);
      }
    }

    // Student data for presentation
    const studentsData = [
      // Computer Science Faculty
      {
        email: 'marko.petrovic@student.university.rs',
        firstName: 'Marko',
        lastName: 'Petrović',
        studentIndex: '2021/001',
        year: 3,
        faculty: 'Computer Science',
        averageGrade: 8.7,
        ectsEarned: 120,
        coursesEnrolled: 5,
        enrollmentYear: '2021',
        phoneNumber: '+381-11-111-0001',
        jmbg: '0101990123456'
      },
      {
        email: 'ana.jovanovic@student.university.rs',
        firstName: 'Ana',
        lastName: 'Jovanović',
        studentIndex: '2021/002',
        year: 3,
        faculty: 'Computer Science',
        averageGrade: 9.2,
        ectsEarned: 135,
        coursesEnrolled: 6,
        enrollmentYear: '2021',
        phoneNumber: '+381-11-111-0002',
        jmbg: '0202990123457'
      },
      {
        email: 'stefan.nikolic@student.university.rs',
        firstName: 'Stefan',
        lastName: 'Nikolić',
        studentIndex: '2022/001',
        year: 2,
        faculty: 'Computer Science',
        averageGrade: 7.8,
        ectsEarned: 90,
        coursesEnrolled: 4,
        enrollmentYear: '2022',
        phoneNumber: '+381-11-111-0003',
        jmbg: '0303000123458'
      },

      // Mathematics Faculty
      {
        email: 'milica.stojanovic@student.university.rs',
        firstName: 'Milica',
        lastName: 'Stojanović',
        studentIndex: '2020/003',
        year: 4,
        faculty: 'Mathematics',
        averageGrade: 9.5,
        ectsEarned: 180,
        coursesEnrolled: 8,
        enrollmentYear: '2020',
        phoneNumber: '+381-11-222-0001',
        jmbg: '0404980123459'
      },
      {
        email: 'nikola.mitrovic@student.university.rs',
        firstName: 'Nikola',
        lastName: 'Mitrović',
        studentIndex: '2022/002',
        year: 2,
        faculty: 'Mathematics',
        averageGrade: 8.9,
        ectsEarned: 95,
        coursesEnrolled: 4,
        enrollmentYear: '2022',
        phoneNumber: '+381-11-222-0002',
        jmbg: '0505000123460'
      },
      {
        email: 'jovana.radic@student.university.rs',
        firstName: 'Jovana',
        lastName: 'Radić',
        studentIndex: '2021/003',
        year: 3,
        faculty: 'Mathematics',
        averageGrade: 8.1,
        ectsEarned: 115,
        coursesEnrolled: 5,
        enrollmentYear: '2021',
        phoneNumber: '+381-11-222-0003',
        jmbg: '0606990123461'
      },

      // Physics Faculty
      {
        email: 'luka.popovic@student.university.rs',
        firstName: 'Luka',
        lastName: 'Popović',
        studentIndex: '2020/004',
        year: 4,
        faculty: 'Physics',
        averageGrade: 7.6,
        ectsEarned: 165,
        coursesEnrolled: 7,
        enrollmentYear: '2020',
        phoneNumber: '+381-11-333-0001',
        jmbg: '0707980123462'
      },
      {
        email: 'teodora.stankovic@student.university.rs',
        firstName: 'Teodora',
        lastName: 'Stanković',
        studentIndex: '2022/003',
        year: 2,
        faculty: 'Physics',
        averageGrade: 9.1,
        ectsEarned: 88,
        coursesEnrolled: 4,
        enrollmentYear: '2022',
        phoneNumber: '+381-11-333-0002',
        jmbg: '0808000123463'
      },
      {
        email: 'milos.djordjevic@student.university.rs',
        firstName: 'Miloš',
        lastName: 'Đorđević',
        studentIndex: '2021/004',
        year: 3,
        faculty: 'Physics',
        averageGrade: 8.4,
        ectsEarned: 125,
        coursesEnrolled: 6,
        enrollmentYear: '2021',
        phoneNumber: '+381-11-333-0003',
        jmbg: '0909990123464'
      },

      // Engineering Faculty
      {
        email: 'dusan.ilic@student.university.rs',
        firstName: 'Dušan',
        lastName: 'Ilić',
        studentIndex: '2020/005',
        year: 4,
        faculty: 'Engineering',
        averageGrade: 8.8,
        ectsEarned: 175,
        coursesEnrolled: 8,
        enrollmentYear: '2020',
        phoneNumber: '+381-11-444-0001',
        jmbg: '1010980123465'
      },
      {
        email: 'isidora.markovic@student.university.rs',
        firstName: 'Isidora',
        lastName: 'Marković',
        studentIndex: '2022/004',
        year: 2,
        faculty: 'Engineering',
        averageGrade: 7.9,
        ectsEarned: 82,
        coursesEnrolled: 4,
        enrollmentYear: '2022',
        phoneNumber: '+381-11-444-0002',
        jmbg: '1111000123466'
      },
      {
        email: 'vladimir.kostic@student.university.rs',
        firstName: 'Vladimir',
        lastName: 'Kostić',
        studentIndex: '2021/005',
        year: 3,
        faculty: 'Engineering',
        averageGrade: 8.6,
        ectsEarned: 130,
        coursesEnrolled: 6,
        enrollmentYear: '2021',
        phoneNumber: '+381-11-444-0003',
        jmbg: '1212990123467'
      }
    ];

    // Create students
    let studentsCreated = 0;
    for (const studentData of studentsData) {
      // Find the study program for this student's faculty
      const studyProgram = studyPrograms.find(sp => sp.faculty === studentData.faculty)?.studyProgram;
      
      if (!studyProgram) {
        console.warn(`Study program not found for faculty: ${studentData.faculty}`);
        continue;
      }

      // Check if student already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: studentData.email }
      });

      if (existingUser) {
        console.log(`Student already exists: ${studentData.email}`);
        continue;
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email: studentData.email,
          password: await bcrypt.hash('student123', 10),
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          role: UserRole.STUDENT,
          isActive: true,
        }
      });

      // Create student profile
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          studentIndex: studentData.studentIndex,
          year: studentData.year,
          studyProgramId: studyProgram.id,
          phoneNumber: studentData.phoneNumber,
          status: StudentStatus.ACTIVE,
          enrollmentYear: studentData.enrollmentYear,
          jmbg: studentData.jmbg
        }
      });

      // Create student enrollment
      await prisma.studentEnrollment.create({
        data: {
          studentId: user.id,
          studyProgramId: studyProgram.id,
          year: studentData.year,
          academicYear: studentData.enrollmentYear,
          status: StudentStatus.ACTIVE
        }
      });

      studentsCreated++;
      console.log(`Student created: ${studentData.firstName} ${studentData.lastName} (${studentData.faculty})`);
    }

    console.log(`Student Search data seeding completed! Created ${studentsCreated} students across ${faculties.length} faculties.`);
    
    return {
      studentsCreated,
      facultiesProcessed: faculties.length,
      studyProgramsCreated: studyPrograms.length
    };

  } catch (error) {
    console.error('Error during Student Search data seeding:', error);
    throw error;
  }
}

// Run if this file is executed directly
async function main() {
  try {
    const results = await seedStudentSearchData();
    console.log('📊 Seeding results:', results);
  } catch (error) {
    console.error('Failed to seed student search data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check if this file is being run directly
if (require.main === module) {
  main();
}
