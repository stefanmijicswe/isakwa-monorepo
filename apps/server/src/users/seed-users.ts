import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaService) {
  console.log('🌱 Seeding users...');

  // Get Computer Science department ID
  const computerScienceDept = await prisma.department.findFirst({
    where: { name: 'Computer Science' }
  });
  
  if (!computerScienceDept) {
    throw new Error('Computer Science department not found. Please run departments seed first.');
  }

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@isakwa.edu' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@isakwa.edu',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log('✅ Admin user created:', admin.email);
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Check if professor already exists
  const existingProfessor = await prisma.user.findUnique({
    where: { email: 'professor@isakwa.edu' }
  });

  if (!existingProfessor) {
    const hashedPassword = await bcrypt.hash('professor123', 10);
    
    const professor = await prisma.user.create({
      data: {
        email: 'professor@isakwa.edu',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: UserRole.PROFESSOR,
        isActive: true,
      },
    });

    // Create professor profile
    await prisma.professorProfile.create({
      data: {
        userId: professor.id,
        departmentId: computerScienceDept.id,
        title: 'Associate Professor',
        phoneNumber: '+381-11-123-4567',
        officeRoom: 'A-101',
      },
    });
    console.log('✅ Professor user created:', professor.email);
  } else {
    console.log('ℹ️ Professor user already exists');
  }

  // Check if student already exists
  const existingStudent = await prisma.user.findUnique({
    where: { email: 'student@isakwa.edu' }
  });

  if (!existingStudent) {
    const hashedPassword = await bcrypt.hash('student123', 10);
    
    const student = await prisma.user.create({
      data: {
        email: 'student@isakwa.edu',
        password: hashedPassword,
        firstName: 'Marko',
        lastName: 'Petrović',
        role: UserRole.STUDENT,
        isActive: true,
      },
    });

    // Create student profile
    await prisma.studentProfile.create({
      data: {
        userId: student.id,
        studentIndex: '2023/001',
        year: 2,
        phoneNumber: '+381-11-987-6543',
      },
    });
    console.log('✅ Student user created:', student.email);
  } else {
    console.log('ℹ️ Student user already exists');
  }

  // Create additional test students
  const testStudents = [
    {
      email: 'ana.jovanovic@isakwa.edu',
      firstName: 'Ana',
      lastName: 'Jovanović',
      studentIndex: '2023/002',
      year: 1,
      phoneNumber: '+381-11-111-1111',
    },
    {
      email: 'petar.mitrovic@isakwa.edu',
      firstName: 'Petar',
      lastName: 'Mitrović',
      studentIndex: '2023/003',
      year: 3,
      phoneNumber: '+381-11-222-2222',
    },
    {
      email: 'marija.stankovic@isakwa.edu',
      firstName: 'Marija',
      lastName: 'Stanković',
      studentIndex: '2023/004',
      year: 2,
      phoneNumber: '+381-11-333-3333',
    },
    {
      email: 'nikola.djordjevic@isakwa.edu',
      firstName: 'Nikola',
      lastName: 'Đorđević',
      studentIndex: '2023/005',
      year: 1,
      phoneNumber: '+381-11-444-4444',
    },
  ];

  for (const studentData of testStudents) {
    const existingStudent = await prisma.user.findUnique({
      where: { email: studentData.email }
    });

    if (!existingStudent) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      
      const student = await prisma.user.create({
        data: {
          email: studentData.email,
          password: hashedPassword,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          role: UserRole.STUDENT,
          isActive: true,
        },
      });

      // Create student profile
      await prisma.studentProfile.create({
        data: {
          userId: student.id,
          studentIndex: studentData.studentIndex,
          year: studentData.year,
          phoneNumber: studentData.phoneNumber,
        },
      });
      console.log('✅ Test student created:', student.email);
    }
  }

  // Create student service users
  const studentServiceUsers = [
    {
      email: 'test@isakwa.edu',
      firstName: 'Test',
      lastName: 'User',
      position: 'Administrative Assistant',
      phoneNumber: '+381-11-555-5555',
      officeRoom: 'B-201',
    },
    {
      email: 'test2@isakwa.edu',
      firstName: 'Test2',
      lastName: 'User',
      position: 'Office Manager',
      phoneNumber: '+381-11-666-6666',
      officeRoom: 'B-202',
    },
    {
      email: 'service@isakwa.edu',
      firstName: 'Service',
      lastName: 'Staff',
      position: 'Student Coordinator',
      phoneNumber: '+381-11-777-7777',
      officeRoom: 'B-203',
    },
  ];

  for (const userData of studentServiceUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: UserRole.STUDENT_SERVICE,
          isActive: true,
        },
      });

      // Create student service profile
      await prisma.studentServiceProfile.create({
        data: {
          userId: user.id,
          departmentId: computerScienceDept.id,
          position: userData.position,
          phoneNumber: userData.phoneNumber,
          officeRoom: userData.officeRoom,
        },
      });
      console.log('✅ Student service user created:', user.email);
    }
  }

  console.log('✅ Users seeding completed!');
}
