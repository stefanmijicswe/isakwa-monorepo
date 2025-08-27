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
exports.StudentRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let StudentRequestsService = class StudentRequestsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createRequest(createRequestDto, studentId) {
        // Verify user is a student
        const user = await this.prisma.user.findUnique({
            where: { id: studentId },
            include: { studentProfile: true },
        });
        if (!user || user.role !== client_1.UserRole.STUDENT || !user.studentProfile) {
            throw new common_1.ForbiddenException('Only students can create requests');
        }
        // Create the request
        const request = await this.prisma.studentRequest.create({
            data: {
                studentId,
                type: createRequestDto.type,
                title: createRequestDto.title,
                description: createRequestDto.description,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        studentProfile: {
                            select: {
                                studentIndex: true,
                            },
                        },
                    },
                },
            },
        });
        // Send notification to student service
        await this.notificationsService.createNotification({
            title: `New ${createRequestDto.type.toLowerCase()}: ${createRequestDto.title}`,
            message: `Student ${user.firstName} ${user.lastName} (${user.studentProfile.studentIndex}) has submitted a new ${createRequestDto.type.toLowerCase()}.`,
            type: client_1.NotificationType.ADMINISTRATIVE,
            priority: client_1.NotificationPriority.NORMAL,
        }, studentId);
        return request;
    }
    async findAllRequests(userId, userRole, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        // Students can only see their own requests
        // Student Service and Admin can see all requests
        const whereClause = userRole === client_1.UserRole.STUDENT
            ? { studentId: userId }
            : {}; // Student Service and Admin see all
        const [requests, total] = await Promise.all([
            this.prisma.studentRequest.findMany({
                where: whereClause,
                include: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            studentProfile: {
                                select: {
                                    studentIndex: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                            attachments: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.studentRequest.count({ where: whereClause }),
        ]);
        return {
            requests,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findRequestById(requestId, userId, userRole) {
        const request = await this.prisma.studentRequest.findUnique({
            where: { id: requestId },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        studentProfile: {
                            select: {
                                studentIndex: true,
                            },
                        },
                    },
                },
                comments: {
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
                    orderBy: { createdAt: 'asc' },
                },
                attachments: true,
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        // Students can only access their own requests
        if (userRole === client_1.UserRole.STUDENT && request.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only access your own requests');
        }
        return request;
    }
    async updateRequestStatus(requestId, updateStatusDto, userId, userRole) {
        // Only Student Service and Admin can update status
        if (userRole !== client_1.UserRole.STUDENT_SERVICE && userRole !== client_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only student service personnel can update request status');
        }
        const request = await this.prisma.studentRequest.findUnique({
            where: { id: requestId },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        const updatedRequest = await this.prisma.studentRequest.update({
            where: { id: requestId },
            data: { status: updateStatusDto.status },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        studentProfile: {
                            select: {
                                studentIndex: true,
                            },
                        },
                    },
                },
            },
        });
        // Send notification to student about status change
        const statusMessages = {
            [client_1.RequestStatus.PENDING]: 'is now pending review',
            [client_1.RequestStatus.IN_REVIEW]: 'is being reviewed',
            [client_1.RequestStatus.APPROVED]: 'has been approved',
            [client_1.RequestStatus.REJECTED]: 'has been rejected',
        };
        await this.notificationsService.createNotification({
            title: `Request Status Updated: ${request.title}`,
            message: `Your ${request.type.toLowerCase()} "${request.title}" ${statusMessages[updateStatusDto.status]}.`,
            type: client_1.NotificationType.ADMINISTRATIVE,
            priority: updateStatusDto.status === client_1.RequestStatus.APPROVED || updateStatusDto.status === client_1.RequestStatus.REJECTED
                ? client_1.NotificationPriority.HIGH
                : client_1.NotificationPriority.NORMAL,
        }, userId);
        return updatedRequest;
    }
    async addComment(requestId, createCommentDto, userId, userRole) {
        const request = await this.prisma.studentRequest.findUnique({
            where: { id: requestId },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        // Students can only comment on their own requests
        if (userRole === client_1.UserRole.STUDENT && request.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only comment on your own requests');
        }
        const comment = await this.prisma.requestComment.create({
            data: {
                requestId,
                userId,
                comment: createCommentDto.comment,
            },
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
        });
        // Send notification to the other party (student or student service)
        const isStudentCommenting = userRole === client_1.UserRole.STUDENT;
        const notificationMessage = isStudentCommenting
            ? `Student ${comment.user.firstName} ${comment.user.lastName} added a comment to their ${request.type.toLowerCase()}: "${request.title}"`
            : `Student service added a comment to your ${request.type.toLowerCase()}: "${request.title}"`;
        await this.notificationsService.createNotification({
            title: `New Comment: ${request.title}`,
            message: notificationMessage,
            type: client_1.NotificationType.ADMINISTRATIVE,
            priority: client_1.NotificationPriority.NORMAL,
        }, userId);
        return comment;
    }
    async getRequestComments(requestId, userId, userRole) {
        const request = await this.prisma.studentRequest.findUnique({
            where: { id: requestId },
            select: { studentId: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        // Students can only access comments on their own requests
        if (userRole === client_1.UserRole.STUDENT && request.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only access comments on your own requests');
        }
        return this.prisma.requestComment.findMany({
            where: { requestId },
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
            orderBy: { createdAt: 'asc' },
        });
    }
    async getRequestAttachments(requestId, userId, userRole) {
        const request = await this.prisma.studentRequest.findUnique({
            where: { id: requestId },
            select: { studentId: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        // Students can only access attachments on their own requests
        if (userRole === client_1.UserRole.STUDENT && request.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only access attachments on your own requests');
        }
        return this.prisma.requestAttachment.findMany({
            where: { requestId },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async deleteRequest(requestId, userId, userRole) {
        // Only admins or the request creator can delete requests
        const request = await this.prisma.studentRequest.findUnique({
            where: { id: requestId },
            select: { studentId: true, status: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (userRole !== client_1.UserRole.ADMIN && request.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own requests');
        }
        // Prevent deletion of approved/rejected requests
        if (request.status === client_1.RequestStatus.APPROVED || request.status === client_1.RequestStatus.REJECTED) {
            throw new common_1.ForbiddenException('Cannot delete processed requests');
        }
        return this.prisma.studentRequest.delete({
            where: { id: requestId },
        });
    }
};
exports.StudentRequestsService = StudentRequestsService;
exports.StudentRequestsService = StudentRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], StudentRequestsService);
