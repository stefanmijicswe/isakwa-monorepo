import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationPriority } from '@prisma/client';

export async function seedNotifications(prisma: PrismaService) {
  console.log('Seeding notifications...');

  // Get existing subjects and professors
  const subjects = await prisma.subject.findMany({ take: 3 });
  const professors = await prisma.user.findMany({
    where: { role: 'PROFESSOR' },
    take: 2,
  });

  if (professors.length === 0) {
    console.log('No professors found, skipping notifications seeding');
    return;
  }

  const professor = professors[0];

  // Create course-specific notifications
  for (const subject of subjects) {
    const notifications = [
      {
        title: 'Welcome to the Course!',
        message: `Welcome to ${subject.name}! This course will cover fundamental concepts and practical applications. Please review the syllabus and course schedule.`,
        type: NotificationType.COURSE_ANNOUNCEMENT,
        priority: NotificationPriority.NORMAL,
        subjectId: subject.id,
      },
      {
        title: 'Midterm Exam Reminder',
        message: 'The midterm exam is scheduled for next week. Please review all materials covered so far.',
        type: NotificationType.EXAM_REMINDER,
        priority: NotificationPriority.HIGH,
        subjectId: subject.id,
      },
      {
        title: 'Assignment Due Date',
        message: 'The first assignment is due this Friday. Make sure to submit on time.',
        type: NotificationType.ASSIGNMENT_DUE,
        priority: NotificationPriority.HIGH,
        subjectId: subject.id,
      },
      {
        title: 'Office Hours Update',
        message: 'Office hours have been updated to Tuesday and Thursday 2-4 PM.',
        type: NotificationType.COURSE_ANNOUNCEMENT,
        priority: NotificationPriority.NORMAL,
        subjectId: subject.id,
      },
    ];

    for (const notification of notifications) {
      const createdNotification = await prisma.notification.create({
        data: {
          ...notification,
          createdBy: professor.id,
          isActive: true,
        },
      });

      // Get students enrolled in this subject
      const enrolledStudents = await prisma.courseEnrollment.findMany({
        where: { subjectId: subject.id },
        include: { student: true },
      });

      // Create notification recipients for all enrolled students
      for (const enrollment of enrolledStudents) {
        await prisma.notificationRecipient.create({
          data: {
            notificationId: createdNotification.id,
            userId: enrollment.student.userId,
            isRead: false,
          },
        });
      }

      console.log(`Created notification: ${notification.title} for ${subject.name}`);
    }
  }

  // Create general system notifications
  const generalNotifications = [
          {
        title: 'Academic Calendar Update',
        message: 'The academic calendar has been updated. Please check the new exam dates and holidays.',
        type: NotificationType.GENERAL,
        priority: NotificationPriority.NORMAL,
      },
      {
        title: 'Library Maintenance',
        message: 'The university library will be closed for maintenance this weekend.',
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.LOW,
      },
  ];

  for (const notification of generalNotifications) {
    const createdNotification = await prisma.notification.create({
      data: {
        ...notification,
        createdBy: professor.id,
        isActive: true,
      },
    });

          // Get all students
      const allStudents = await prisma.studentProfile.findMany({
        include: { user: true },
      });

    // Create notification recipients for all students
    for (const student of allStudents) {
      await prisma.notificationRecipient.create({
        data: {
          notificationId: createdNotification.id,
          userId: student.userId,
          isRead: false,
        },
      });
    }

    console.log(`Created general notification: ${notification.title}`);
  }

  console.log('Notifications seeding completed!');
}
