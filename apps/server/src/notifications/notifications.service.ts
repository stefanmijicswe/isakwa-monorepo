import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
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
}
