import { PrismaService } from '../prisma/prisma.service';
import { TeachingType, SemesterType } from '@prisma/client';

export async function seedCourseSchedules(prisma: PrismaService) {
  console.log('Seeding course schedules...');

  // Create course schedules for existing subjects
  const subjects = await prisma.subject.findMany({ take: 5 });
  
  for (const subject of subjects) {
    // Create course schedule for winter semester 2024/2025
    const schedule = await prisma.courseSchedule.create({
      data: {
        subjectId: subject.id,
        academicYear: '2024/2025',
        semesterType: SemesterType.WINTER,
        isActive: true,
      },
    });

    // Create course sessions for 5 weeks
    const sessions = [
      {
        title: 'Week 1: Introduction',
        description: 'Course overview and basic concepts',
        sessionDate: new Date('2024-09-02'),
        startTime: '09:00',
        endTime: '10:30',
        room: 'A101',
        sessionType: TeachingType.LECTURE,
      },
      {
        title: 'Week 2: Core Concepts',
        description: 'Fundamental principles and theories',
        sessionDate: new Date('2024-09-09'),
        startTime: '09:00',
        endTime: '10:30',
        room: 'A101',
        sessionType: TeachingType.LECTURE,
      },
      {
        title: 'Week 3: Practical Applications',
        description: 'Real-world examples and case studies',
        sessionDate: new Date('2024-09-16'),
        startTime: '09:00',
        endTime: '10:30',
        room: 'A101',
        sessionType: TeachingType.LECTURE,
      },
      {
        title: 'Week 4: Advanced Topics',
        description: 'Complex scenarios and advanced techniques',
        sessionDate: new Date('2024-09-23'),
        startTime: '09:00',
        endTime: '10:30',
        room: 'A101',
        sessionType: TeachingType.LECTURE,
      },
      {
        title: 'Week 5: Review and Assessment',
        description: 'Course review and preparation for exams',
        sessionDate: new Date('2024-09-30'),
        startTime: '09:00',
        endTime: '10:30',
        room: 'A101',
        sessionType: TeachingType.LECTURE,
      },
      // Exercise sessions
      {
        title: 'Week 1: Exercise Session',
        description: 'Practice problems and group work',
        sessionDate: new Date('2024-09-04'),
        startTime: '14:00',
        endTime: '15:30',
        room: 'B201',
        sessionType: TeachingType.EXERCISE,
      },
      {
        title: 'Week 2: Exercise Session',
        description: 'Practice problems and group work',
        sessionDate: new Date('2024-09-11'),
        startTime: '14:00',
        endTime: '15:30',
        room: 'B201',
        sessionType: TeachingType.EXERCISE,
      },
      {
        title: 'Week 3: Exercise Session',
        description: 'Practice problems and group work',
        sessionDate: new Date('2024-09-18'),
        startTime: '14:00',
        endTime: '15:30',
        room: 'B201',
        sessionType: TeachingType.EXERCISE,
      },
      {
        title: 'Week 4: Exercise Session',
        description: 'Practice problems and group work',
        sessionDate: new Date('2024-09-25'),
        startTime: '14:00',
        endTime: '15:30',
        room: 'B201',
        sessionType: TeachingType.EXERCISE,
      },
      {
        title: 'Week 5: Exercise Session',
        description: 'Practice problems and group work',
        sessionDate: new Date('2024-10-02'),
        startTime: '14:00',
        endTime: '15:30',
        room: 'B201',
        sessionType: TeachingType.EXERCISE,
      },
    ];

    for (const session of sessions) {
      await prisma.courseSession.create({
        data: {
          schedule: { connect: { id: schedule.id } },
          ...session,
          isActive: true,
        },
      });
    }

    console.log(`Created course schedule for ${subject.name}`);
  }

  console.log('Course schedules seeding completed!');
}
