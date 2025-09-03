import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateCourseNotificationDto } from './dto/create-course-notification.dto';
import { NotificationType, NotificationPriority } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(createNotificationDto: CreateNotificationDto, createdBy: number) {
    // Create the notification
    const notification = await this.prisma.notification.create({
      data: {
        title: createNotificationDto.title,
        message: createNotificationDto.message,
        type: createNotificationDto.type || NotificationType.GENERAL,
        priority: createNotificationDto.priority || NotificationPriority.NORMAL,
        createdBy: createdBy,
      },
    });

    // Get ALL users in the system (including inactive ones to ensure complete coverage)
    const allUsers = await this.prisma.user.findMany({
      select: { id: true },
    });

    // Also explicitly get all student service personnel to ensure they receive notifications
    const studentServiceUsers = await this.prisma.user.findMany({
      where: { 
        role: 'STUDENT_SERVICE',
        studentServiceProfile: { isNot: null }
      },
      select: { id: true },
    });

    // Combine all users and ensure no duplicates
    const allUserIds = new Set([
      ...allUsers.map(user => user.id),
      ...studentServiceUsers.map(user => user.id),
      createdBy // Explicitly include the creator
    ]);

    // Create notification recipients for ALL users
    const recipients = Array.from(allUserIds).map(userId => ({
      notificationId: notification.id,
      userId: userId,
    }));

    await this.prisma.notificationRecipient.createMany({
      data: recipients,
    });

    return notification;
  }

  async getAllNotifications() {
    return this.prisma.notification.findMany({
      where: { isActive: true },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserNotifications(userId: number) {
    return this.prisma.notificationRecipient.findMany({
      where: { userId },
      include: {
        notification: {
          include: {
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { notification: { createdAt: 'desc' } },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    return this.prisma.notificationRecipient.updateMany({
      where: {
        notificationId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notificationRecipient.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async deleteNotification(notificationId: number, userId: number) {
    // Check if user is the creator of the notification
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
      select: { createdBy: true },
    });

    if (!notification || notification.createdBy !== userId) {
      throw new Error('Unauthorized to delete this notification');
    }

    // Delete notification recipients first
    await this.prisma.notificationRecipient.deleteMany({
      where: { notificationId },
    });

    // Delete the notification
    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async createCourseNotification(createCourseNotificationDto: CreateCourseNotificationDto, professorId: number) {
    console.log('📢 Creating course notification:', createCourseNotificationDto);
    console.log('👨‍🏫 Professor ID:', professorId);

    // Verify professor teaches this subject if subjectId is provided
    if (createCourseNotificationDto.subjectId) {
      const assignment = await this.prisma.professorAssignment.findFirst({
        where: {
          professorId: professorId,
          subjectId: createCourseNotificationDto.subjectId,
          isActive: true,
        },
        include: {
          subject: true
        }
      });

      if (!assignment) {
        throw new Error('You are not authorized to create notifications for this subject');
      }

      console.log('✅ Professor is authorized for subject:', assignment.subject.name);
    }

    // Create the notification
    const notification = await this.prisma.notification.create({
      data: {
        title: createCourseNotificationDto.title,
        message: createCourseNotificationDto.message,
        type: createCourseNotificationDto.type || NotificationType.GENERAL,
        priority: createCourseNotificationDto.priority || NotificationPriority.NORMAL,
        createdBy: professorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    console.log('✅ Notification created:', notification);

    // Determine recipients based on subject
    let recipientUserIds: number[] = [];

    if (createCourseNotificationDto.subjectId) {
      // Get all students enrolled in this subject
      const enrollments = await this.prisma.courseEnrollment.findMany({
        where: {
          subjectId: createCourseNotificationDto.subjectId,
          isActive: true,
        },
        select: {
          studentId: true,
        },
      });

      recipientUserIds = enrollments.map(enrollment => enrollment.studentId);
      console.log(`📚 Found ${recipientUserIds.length} students enrolled in subject ${createCourseNotificationDto.subjectId}`);
    } else {
      // If no specific subject, send to all students of professor's subjects
      const professorAssignments = await this.prisma.professorAssignment.findMany({
        where: {
          professorId: professorId,
          isActive: true,
        },
        select: {
          subjectId: true,
        },
      });

      const subjectIds = professorAssignments.map(assignment => assignment.subjectId);

      const enrollments = await this.prisma.courseEnrollment.findMany({
        where: {
          subjectId: { in: subjectIds },
          isActive: true,
        },
        select: {
          studentId: true,
        },
      });

      recipientUserIds = [...new Set(enrollments.map(enrollment => enrollment.studentId))]; // Remove duplicates
      console.log(`📚 Found ${recipientUserIds.length} unique students across professor's ${subjectIds.length} subjects`);
    }

    // Also include the professor as a recipient
    recipientUserIds.push(professorId);

    // Create notification recipients
    if (recipientUserIds.length > 0) {
      const recipients = recipientUserIds.map(userId => ({
        notificationId: notification.id,
        userId: userId,
      }));

      await this.prisma.notificationRecipient.createMany({
        data: recipients,
      });

      console.log(`📤 Created notification recipients for ${recipientUserIds.length} users`);
    }

    // Return notification with recipients included
    return this.prisma.notification.findUnique({
      where: { id: notification.id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
