import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestType, RequestCategory, UserRole, NotificationType, NotificationPriority } from '@prisma/client';

@Injectable()
export class RequestRoutingService {
  private readonly logger = new Logger(RequestRoutingService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Automatically assigns request to appropriate personnel based on category and type
   */
  async autoAssignRequest(requestId: number): Promise<void> {
    const request = await this.prisma.studentRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          include: {
            studentProfile: {
              include: {
                studyProgram: {
                  include: {
                    faculty: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!request) {
      this.logger.error(`Request with ID ${requestId} not found`);
      return;
    }

    const assignedStaffId = await this.determineAssignedStaff(request);
    if (!assignedStaffId) {
      this.logger.warn(`No appropriate staff found for request ${requestId}`);
      return;
    }

    // Calculate due date based on request type and category
    const dueDate = this.calculateDueDate(request.type, request.category);

    // Update request with assignment
    await this.prisma.studentRequest.update({
      where: { id: requestId },
      data: {
        assignedTo: assignedStaffId,
        dueDate,
        status: 'IN_REVIEW',
      },
    });

    // Send notification to assigned staff
    await this.notifyAssignedStaff(request, assignedStaffId);

    this.logger.log(`Request ${requestId} automatically assigned to staff ${assignedStaffId}`);
  }

  /**
   * Determines appropriate staff member based on request category and student's faculty
   */
  private async determineAssignedStaff(request: any): Promise<number | null> {
    const { category, student } = request;
    const facultyId = student.studentProfile?.studyProgram?.facultyId;

    let targetRole: UserRole;
    let searchInFaculty = false;

    // Determine target role based on category
    switch (category) {
      case RequestCategory.ACADEMIC:
        targetRole = UserRole.PROFESSOR;
        searchInFaculty = true;
        break;
      case RequestCategory.ADMINISTRATIVE:
      case RequestCategory.FINANCIAL:
        targetRole = UserRole.STUDENT_SERVICE;
        searchInFaculty = true;
        break;
      case RequestCategory.DISCIPLINARY:
        targetRole = UserRole.ADMIN;
        break;
      case RequestCategory.TECHNICAL:
        targetRole = UserRole.ADMIN;
        break;
      default:
        targetRole = UserRole.STUDENT_SERVICE;
        searchInFaculty = true;
    }

    // Find appropriate staff member
    const whereClause: any = {
      role: targetRole,
      isActive: true,
    };

    if (searchInFaculty && facultyId) {
      if (targetRole === UserRole.PROFESSOR) {
        whereClause.professorProfile = {
          department: {
            facultyId,
          },
        };
      } else if (targetRole === UserRole.STUDENT_SERVICE) {
        whereClause.studentServiceProfile = {
          department: {
            facultyId,
          },
        };
      }
    }

    // Find staff with least assigned requests (load balancing)
    const staffMembers = await this.prisma.user.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            assignedRequests: {
              where: {
                status: {
                  in: ['PENDING', 'IN_REVIEW'],
                },
              },
            },
          },
        },
      },
      orderBy: {
        assignedRequests: {
          _count: 'asc',
        },
      },
      take: 1,
    });

    return staffMembers.length > 0 ? staffMembers[0].id : null;
  }

  /**
   * Calculates due date based on request type and category
   */
  private calculateDueDate(type: RequestType, category: RequestCategory): Date {
    const now = new Date();
    let daysToAdd = 7; // Default 7 days

    // Adjust due date based on type and category
    if (type === RequestType.COMPLAINT) {
      daysToAdd = 3; // Complaints are more urgent
    } else {
      switch (category) {
        case RequestCategory.ACADEMIC:
          daysToAdd = 5;
          break;
        case RequestCategory.ADMINISTRATIVE:
          daysToAdd = 7;
          break;
        case RequestCategory.FINANCIAL:
          daysToAdd = 10;
          break;
        case RequestCategory.DISCIPLINARY:
          daysToAdd = 3;
          break;
        case RequestCategory.TECHNICAL:
          daysToAdd = 5;
          break;
        default:
          daysToAdd = 7;
      }
    }

    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + daysToAdd);
    return dueDate;
  }

  /**
   * Sends notification to assigned staff member
   */
  private async notifyAssignedStaff(request: any, assignedStaffId: number): Promise<void> {
    const requestTypeLabel = request.type === RequestType.COMPLAINT ? 'complaint' : 'request';
    const categoryLabel = request.category.toLowerCase().replace('_', ' ');

    await this.notificationsService.createNotification(
      {
        title: `New ${requestTypeLabel} assigned: ${request.title}`,
        message: `You have been assigned a new ${categoryLabel} ${requestTypeLabel} from student ${request.student.firstName} ${request.student.lastName}. Please review and respond accordingly.`,
        type: NotificationType.ADMINISTRATIVE,
        priority: request.type === RequestType.COMPLAINT ? NotificationPriority.HIGH : NotificationPriority.NORMAL,
      },
      assignedStaffId,
    );
  }

  /**
   * Sends escalation notification when request is overdue
   */
  async checkAndEscalateOverdueRequests(): Promise<void> {
    const overdueRequests = await this.prisma.studentRequest.findMany({
      where: {
        status: {
          in: ['PENDING', 'IN_REVIEW'],
        },
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        assignedStaff: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    for (const request of overdueRequests) {
      // Find admin users to escalate to
      const admins = await this.prisma.user.findMany({
        where: {
          role: UserRole.ADMIN,
          isActive: true,
        },
      });

      for (const admin of admins) {
        await this.notificationsService.createNotification(
          {
            title: `Overdue Request: ${request.title}`,
            message: `Request from ${request.student.firstName} ${request.student.lastName} is overdue. Originally assigned to ${request.assignedStaff?.firstName || 'unassigned'} ${request.assignedStaff?.lastName || ''}.`,
            type: NotificationType.ADMINISTRATIVE,
            priority: NotificationPriority.URGENT,
          },
          admin.id,
        );
      }
    }

    if (overdueRequests.length > 0) {
      this.logger.warn(`Escalated ${overdueRequests.length} overdue requests`);
    }
  }

  /**
   * Reassigns request to different staff member
   */
  async reassignRequest(requestId: number, newAssigneeId: number): Promise<void> {
    const request = await this.prisma.studentRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!request) {
      throw new Error(`Request with ID ${requestId} not found`);
    }

    await this.prisma.studentRequest.update({
      where: { id: requestId },
      data: {
        assignedTo: newAssigneeId,
      },
    });

    // Notify new assignee
    await this.notifyAssignedStaff(request, newAssigneeId);

    this.logger.log(`Request ${requestId} reassigned to staff ${newAssigneeId}`);
  }
}
