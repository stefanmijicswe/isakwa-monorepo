import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestRoutingService } from './request-routing.service';
import { RequestWorkflowService } from './request-workflow.service';
import { CreateStudentRequestDto, UpdateRequestStatusDto, CreateCommentDto } from './dto';
import { RequestStatus, UserRole, NotificationType, NotificationPriority, RequestCategory } from '@prisma/client';

@Injectable()
export class StudentRequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private requestRoutingService: RequestRoutingService,
    private requestWorkflowService: RequestWorkflowService,
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

    // Auto-determine category if not provided
    const category = createRequestDto.category || this.determineCategoryFromTitle(createRequestDto.title);
    const priority = createRequestDto.priority || (createRequestDto.type === 'COMPLAINT' ? NotificationPriority.HIGH : NotificationPriority.NORMAL);

    // Create the request
    const request = await this.prisma.studentRequest.create({
      data: {
        studentId,
        type: createRequestDto.type,
        title: createRequestDto.title,
        description: createRequestDto.description,
        category,
        priority,
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

    // Automatically assign request to appropriate staff
    await this.requestRoutingService.autoAssignRequest(request.id);

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

    // Process workflow before updating status
    await this.requestWorkflowService.processStatusChange(requestId, updateStatusDto.status, userId);

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
        content: createCommentDto.comment,
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

  /**
   * Auto-determines request category based on title keywords
   */
  private determineCategoryFromTitle(title: string): RequestCategory {
    const titleLower = title.toLowerCase();

    // Academic keywords
    if (titleLower.includes('grade') || titleLower.includes('exam') || titleLower.includes('course') || 
        titleLower.includes('professor') || titleLower.includes('syllabus') || titleLower.includes('assignment')) {
      return RequestCategory.ACADEMIC;
    }

    // Financial keywords
    if (titleLower.includes('payment') || titleLower.includes('fee') || titleLower.includes('tuition') || 
        titleLower.includes('scholarship') || titleLower.includes('financial')) {
      return RequestCategory.FINANCIAL;
    }

    // Disciplinary keywords
    if (titleLower.includes('disciplinary') || titleLower.includes('misconduct') || 
        titleLower.includes('violation') || titleLower.includes('appeal')) {
      return RequestCategory.DISCIPLINARY;
    }

    // Technical keywords
    if (titleLower.includes('system') || titleLower.includes('website') || titleLower.includes('login') || 
        titleLower.includes('password') || titleLower.includes('technical') || titleLower.includes('bug')) {
      return RequestCategory.TECHNICAL;
    }

    // Default to administrative
    return RequestCategory.ADMINISTRATIVE;
  }

  /**
   * Get requests assigned to specific user
   */
  async getAssignedRequests(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      this.prisma.studentRequest.findMany({
        where: { assignedTo: userId },
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
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.studentRequest.count({ where: { assignedTo: userId } }),
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

  /**
   * Reassign request to different staff member
   */
  async reassignRequest(requestId: number, newAssigneeId: number, currentUserId: number, userRole: UserRole) {
    // Only admin or current assignee can reassign
    if (userRole !== UserRole.ADMIN) {
      const request = await this.prisma.studentRequest.findUnique({
        where: { id: requestId },
        select: { assignedTo: true },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      if (request.assignedTo !== currentUserId) {
        throw new ForbiddenException('You can only reassign requests assigned to you');
      }
    }

    await this.requestRoutingService.reassignRequest(requestId, newAssigneeId);
    
    return { message: 'Request reassigned successfully' };
  }

  /**
   * Get detailed workflow status for a request
   */
  async getRequestWorkflowStatus(requestId: number, userId: number, userRole: UserRole) {
    // Check permissions first
    const request = await this.prisma.studentRequest.findUnique({
      where: { id: requestId },
      select: { studentId: true, assignedTo: true },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Students can only view their own requests, staff can view assigned requests
    if (userRole === UserRole.STUDENT && request.studentId !== userId) {
      throw new ForbiddenException('You can only view your own requests');
    }

    if (userRole !== UserRole.ADMIN && userRole !== UserRole.STUDENT && 
        request.assignedTo !== userId && request.studentId !== userId) {
      throw new ForbiddenException('You can only view requests assigned to you');
    }

    return this.requestWorkflowService.getRequestWorkflowStatus(requestId);
  }
}
