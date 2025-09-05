import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestStatus, RequestType, RequestCategory, UserRole, NotificationType, NotificationPriority } from '@prisma/client';

@Injectable()
export class RequestWorkflowService {
  private readonly logger = new Logger(RequestWorkflowService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Validates status transition and applies workflow rules
   */
  async processStatusChange(requestId: number, newStatus: RequestStatus, userId: number): Promise<void> {
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
        assignedStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!request) {
      throw new BadRequestException('Request not found');
    }

    // Validate status transition
    this.validateStatusTransition(request.status, newStatus);

    // Apply workflow rules based on new status
    await this.applyWorkflowRules(request, newStatus, userId);

    this.logger.log(`Request ${requestId} status changed from ${request.status} to ${newStatus}`);
  }

  /**
   * Validates if status transition is allowed
   */
  private validateStatusTransition(currentStatus: RequestStatus, newStatus: RequestStatus): void {
    const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
      [RequestStatus.PENDING]: [RequestStatus.IN_REVIEW, RequestStatus.REJECTED],
      [RequestStatus.IN_REVIEW]: [RequestStatus.APPROVED, RequestStatus.REJECTED, RequestStatus.PENDING],
      [RequestStatus.APPROVED]: [], // Final status
      [RequestStatus.REJECTED]: [RequestStatus.IN_REVIEW], // Can be reopened for review
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Status transition from ${currentStatus} to ${newStatus} is not allowed`
      );
    }
  }


  private async applyWorkflowRules(request: any, newStatus: RequestStatus, userId: number): Promise<void> {
    switch (newStatus) {
      case RequestStatus.IN_REVIEW:
        await this.handleInReviewTransition(request, userId);
        break;
      case RequestStatus.APPROVED:
        await this.handleApprovalTransition(request, userId);
        break;
      case RequestStatus.REJECTED:
        await this.handleRejectionTransition(request, userId);
        break;
    }
  }

  /**
   * Handles transition to IN_REVIEW status
   */
  private async handleInReviewTransition(request: any, userId: number): Promise<void> {
    // Notify student that their request is being reviewed
    await this.notificationsService.createNotification(
      {
        title: `Request Under Review: ${request.title}`,
        message: `Your ${request.type.toLowerCase()} "${request.title}" is now being reviewed by our staff.`,
        type: NotificationType.ADMINISTRATIVE,
        priority: NotificationPriority.NORMAL,
      },
      request.studentId,
    );

    // If it's a complaint, notify management
    if (request.type === RequestType.COMPLAINT) {
      await this.notifyManagement(request, 'A complaint is now under review');
    }
  }

  /**
   * Handles approval workflow
   */
  private async handleApprovalTransition(request: any, userId: number): Promise<void> {
    // Notify student of approval
    await this.notificationsService.createNotification(
      {
        title: `Request Approved: ${request.title}`,
        message: `Great news! Your ${request.type.toLowerCase()} "${request.title}" has been approved.`,
        type: NotificationType.ADMINISTRATIVE,
        priority: NotificationPriority.HIGH,
      },
      request.studentId,
    );

    // Apply category-specific approval actions
    await this.executeApprovalActions(request);

    // Log approval for audit
    this.logger.log(`Request ${request.id} approved by user ${userId}`);
  }

  /**
   * Handles rejection workflow
   */
  private async handleRejectionTransition(request: any, userId: number): Promise<void> {
    // Notify student of rejection
    await this.notificationsService.createNotification(
      {
        title: `Request Status Update: ${request.title}`,
        message: `Your ${request.type.toLowerCase()} "${request.title}" has been reviewed. Please check the comments for details.`,
        type: NotificationType.ADMINISTRATIVE,
        priority: NotificationPriority.HIGH,
      },
      request.studentId,
    );

    // If it's a complaint rejection, escalate to higher authority
    if (request.type === RequestType.COMPLAINT) {
      await this.escalateRejectedComplaint(request);
    }

    this.logger.log(`Request ${request.id} rejected by user ${userId}`);
  }

  /**
   * Executes actions specific to approved requests based on category
   */
  private async executeApprovalActions(request: any): Promise<void> {
    switch (request.category) {
      case RequestCategory.ACADEMIC:
        await this.handleAcademicApproval(request);
        break;
      case RequestCategory.FINANCIAL:
        await this.handleFinancialApproval(request);
        break;
      case RequestCategory.ADMINISTRATIVE:
        await this.handleAdministrativeApproval(request);
        break;
      default:
        this.logger.log(`No specific approval actions for category ${request.category}`);
    }
  }

  /**
   * Handles academic request approvals
   */
  private async handleAcademicApproval(request: any): Promise<void> {
    // Could trigger academic record updates, grade changes, etc.
    this.logger.log(`Processing academic approval for request ${request.id}`);
    
    // Example: If it's a grade appeal, could trigger grade review process
    if (request.title.toLowerCase().includes('grade')) {
      // Notify academic staff about approved grade appeal
      const academicStaff = await this.prisma.user.findMany({
        where: {
          role: UserRole.PROFESSOR,
          isActive: true,
        },
      });

      for (const staff of academicStaff) {
        await this.notificationsService.createNotification(
          {
            title: 'Grade Appeal Approved',
            message: `A grade appeal for student ${request.student.firstName} ${request.student.lastName} has been approved and may require your attention.`,
            type: NotificationType.ADMINISTRATIVE,
            priority: NotificationPriority.NORMAL,
          },
          staff.id,
        );
      }
    }
  }

  /**
   * Handles financial request approvals
   */
  private async handleFinancialApproval(request: any): Promise<void> {
    this.logger.log(`Processing financial approval for request ${request.id}`);
    
    // Could trigger financial system updates, payment processing, etc.
    // For now, just notify relevant departments
    await this.notifyFinancialDepartment(request, 'Financial request approved');
  }

  /**
   * Handles administrative request approvals
   */
  private async handleAdministrativeApproval(request: any): Promise<void> {
    this.logger.log(`Processing administrative approval for request ${request.id}`);
    
    const studentServiceStaff = await this.prisma.user.findMany({
      where: {
        role: UserRole.STUDENT_SERVICE,
        isActive: true,
      },
    });

    for (const staff of studentServiceStaff) {
      await this.notificationsService.createNotification(
        {
          title: 'Administrative Request Approved',
          message: `An administrative request from ${request.student.firstName} ${request.student.lastName} has been approved and may require follow-up action.`,
          type: NotificationType.ADMINISTRATIVE,
          priority: NotificationPriority.NORMAL,
        },
        staff.id,
      );
    }
  }

  private async escalateRejectedComplaint(request: any): Promise<void> {
    const admins = await this.prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.createNotification(
        {
          title: 'Complaint Rejected - Review Required',
          message: `A complaint from ${request.student.firstName} ${request.student.lastName} has been rejected. Please review for potential escalation or policy review.`,
          type: NotificationType.ADMINISTRATIVE,
          priority: NotificationPriority.HIGH,
        },
        admin.id,
      );
    }
  }

  /**
   * Notifies management about important request events
   */
  private async notifyManagement(request: any, message: string): Promise<void> {
    const managers = await this.prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.ADMIN, UserRole.STUDENT_SERVICE],
        },
        isActive: true,
      },
    });

    for (const manager of managers) {
      await this.notificationsService.createNotification(
        {
          title: `Management Alert: ${request.type}`,
          message: `${message}. Request: "${request.title}" from ${request.student.firstName} ${request.student.lastName}`,
          type: NotificationType.ADMINISTRATIVE,
          priority: NotificationPriority.HIGH,
        },
        manager.id,
      );
    }
  }

  private async notifyFinancialDepartment(request: any, message: string): Promise<void> {
    // In a real system, this might query specific financial department staff
    const financialStaff = await this.prisma.user.findMany({
      where: {
        role: UserRole.STUDENT_SERVICE, // Assuming they handle financial matters
        isActive: true,
      },
    });

    for (const staff of financialStaff) {
      await this.notificationsService.createNotification(
        {
          title: 'Financial Request Update',
          message: `${message}. Request: "${request.title}" from ${request.student.firstName} ${request.student.lastName}`,
          type: NotificationType.ADMINISTRATIVE,
          priority: NotificationPriority.NORMAL,
        },
        staff.id,
      );
    }
  }

  /**
   * Gets workflow status for a request
   */
  async getRequestWorkflowStatus(requestId: number): Promise<any> {
    const request = await this.prisma.studentRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentProfile: {
              select: {
                studentIndex: true,
              },
            },
          },
        },
        assignedStaff: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!request) {
      throw new BadRequestException('Request not found');
    }

    // Calculate workflow progress
    const progress = this.calculateWorkflowProgress(request.status);
    const nextPossibleStatuses = this.getNextPossibleStatuses(request.status);
    const isOverdue = request.dueDate && new Date() > request.dueDate;

    return {
      ...request,
      workflow: {
        progress,
        nextPossibleStatuses,
        isOverdue,
        daysSinceCreated: Math.floor(
          (new Date().getTime() - request.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        ),
        daysUntilDue: request.dueDate
          ? Math.floor(
              (request.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )
          : null,
      },
    };
  }

  /**
   * Calculates workflow progress percentage
   */
  private calculateWorkflowProgress(status: RequestStatus): number {
    const progressMap = {
      [RequestStatus.PENDING]: 25,
      [RequestStatus.IN_REVIEW]: 50,
      [RequestStatus.APPROVED]: 100,
      [RequestStatus.REJECTED]: 100,
    };

    return progressMap[status] || 0;
  }

  /**
   * Gets next possible statuses for current status
   */
  private getNextPossibleStatuses(currentStatus: RequestStatus): RequestStatus[] {
    const transitions = {
      [RequestStatus.PENDING]: [RequestStatus.IN_REVIEW, RequestStatus.REJECTED],
      [RequestStatus.IN_REVIEW]: [RequestStatus.APPROVED, RequestStatus.REJECTED, RequestStatus.PENDING],
      [RequestStatus.APPROVED]: [],
      [RequestStatus.REJECTED]: [RequestStatus.IN_REVIEW],
    };

    return transitions[currentStatus] || [];
  }
}
