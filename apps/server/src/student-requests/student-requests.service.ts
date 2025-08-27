import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateStudentRequestDto, UpdateRequestStatusDto, CreateCommentDto } from './dto';
import { RequestStatus, UserRole, NotificationType, NotificationPriority } from '@prisma/client';

@Injectable()
export class StudentRequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createRequest(createRequestDto: CreateStudentRequestDto, studentId: number) {
    // Verify user is a student
    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: { studentProfile: true },
    });

    if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
      throw new ForbiddenException('Only students can create requests');
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
    await this.notificationsService.createNotification(
      {
        title: `New ${createRequestDto.type.toLowerCase()}: ${createRequestDto.title}`,
        message: `Student ${user.firstName} ${user.lastName} (${user.studentProfile.studentIndex}) has submitted a new ${createRequestDto.type.toLowerCase()}.`,
        type: NotificationType.ADMINISTRATIVE,
        priority: NotificationPriority.NORMAL,
      },
      studentId,
    );

    return request;
  }

  async findAllRequests(userId: number, userRole: UserRole, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Students can only see their own requests
    // Student Service and Admin can see all requests
    const whereClause = 
      userRole === UserRole.STUDENT 
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

  async findRequestById(requestId: number, userId: number, userRole: UserRole) {
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
      throw new NotFoundException('Request not found');
    }

    // Students can only access their own requests
    if (userRole === UserRole.STUDENT && request.studentId !== userId) {
      throw new ForbiddenException('You can only access your own requests');
    }

    return request;
  }

  async updateRequestStatus(
    requestId: number,
    updateStatusDto: UpdateRequestStatusDto,
    userId: number,
    userRole: UserRole,
  ) {
    // Only Student Service and Admin can update status
    if (userRole !== UserRole.STUDENT_SERVICE && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only student service personnel can update request status');
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
      throw new NotFoundException('Request not found');
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
      [RequestStatus.PENDING]: 'is now pending review',
      [RequestStatus.IN_REVIEW]: 'is being reviewed',
      [RequestStatus.APPROVED]: 'has been approved',
      [RequestStatus.REJECTED]: 'has been rejected',
    };

    await this.notificationsService.createNotification(
      {
        title: `Request Status Updated: ${request.title}`,
        message: `Your ${request.type.toLowerCase()} "${request.title}" ${statusMessages[updateStatusDto.status]}.`,
        type: NotificationType.ADMINISTRATIVE,
        priority: updateStatusDto.status === RequestStatus.APPROVED || updateStatusDto.status === RequestStatus.REJECTED 
          ? NotificationPriority.HIGH 
          : NotificationPriority.NORMAL,
      },
      userId,
    );

    return updatedRequest;
  }

  async addComment(
    requestId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
    userRole: UserRole,
  ) {
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
      throw new NotFoundException('Request not found');
    }

    // Students can only comment on their own requests
    if (userRole === UserRole.STUDENT && request.studentId !== userId) {
      throw new ForbiddenException('You can only comment on your own requests');
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
    const isStudentCommenting = userRole === UserRole.STUDENT;

    const notificationMessage = isStudentCommenting
      ? `Student ${comment.user.firstName} ${comment.user.lastName} added a comment to their ${request.type.toLowerCase()}: "${request.title}"`
      : `Student service added a comment to your ${request.type.toLowerCase()}: "${request.title}"`;

    await this.notificationsService.createNotification(
      {
        title: `New Comment: ${request.title}`,
        message: notificationMessage,
        type: NotificationType.ADMINISTRATIVE,
        priority: NotificationPriority.NORMAL,
      },
      userId,
    );

    return comment;
  }

  async getRequestComments(requestId: number, userId: number, userRole: UserRole) {
    const request = await this.prisma.studentRequest.findUnique({
      where: { id: requestId },
      select: { studentId: true },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Students can only access comments on their own requests
    if (userRole === UserRole.STUDENT && request.studentId !== userId) {
      throw new ForbiddenException('You can only access comments on your own requests');
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

  async getRequestAttachments(requestId: number, userId: number, userRole: UserRole) {
    const request = await this.prisma.studentRequest.findUnique({
      where: { id: requestId },
      select: { studentId: true },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Students can only access attachments on their own requests
    if (userRole === UserRole.STUDENT && request.studentId !== userId) {
      throw new ForbiddenException('You can only access attachments on your own requests');
    }

    return this.prisma.requestAttachment.findMany({
      where: { requestId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async deleteRequest(requestId: number, userId: number, userRole: UserRole) {
    // Only admins or the request creator can delete requests
    const request = await this.prisma.studentRequest.findUnique({
      where: { id: requestId },
      select: { studentId: true, status: true },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (userRole !== UserRole.ADMIN && request.studentId !== userId) {
      throw new ForbiddenException('You can only delete your own requests');
    }

    // Prevent deletion of approved/rejected requests
    if (request.status === RequestStatus.APPROVED || request.status === RequestStatus.REJECTED) {
      throw new ForbiddenException('Cannot delete processed requests');
    }

    return this.prisma.studentRequest.delete({
      where: { id: requestId },
    });
  }
}
