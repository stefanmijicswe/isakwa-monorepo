import { Module } from '@nestjs/common';
import { StudentRequestsService } from './student-requests.service';
import { RequestRoutingService } from './request-routing.service';
import { RequestWorkflowService } from './request-workflow.service';
import { RequestSchedulerService } from './request-scheduler.service';
import { StudentRequestsController } from './student-requests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [StudentRequestsController],
  providers: [StudentRequestsService, RequestRoutingService, RequestWorkflowService, RequestSchedulerService],
  exports: [StudentRequestsService, RequestRoutingService, RequestWorkflowService],
})
export class StudentRequestsModule {}
