"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNotification(createNotificationDto, createdBy) {
        // Create the notification
        const notification = await this.prisma.notification.create({
            data: {
                title: createNotificationDto.title,
                message: createNotificationDto.message,
                type: createNotificationDto.type || client_1.NotificationType.GENERAL,
                priority: createNotificationDto.priority || client_1.NotificationPriority.NORMAL,
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
    async getUserNotifications(userId) {
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
    async markAsRead(notificationId, userId) {
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
    async markAllAsRead(userId) {
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
    async deleteNotification(notificationId, userId) {
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
