import { Module } from '@nestjs/common';
import { StudentRequestsService } from './student-requests.service';
import { StudentRequestsController } from './student-requests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [StudentRequestsController],
  providers: [StudentRequestsService],
  exports: [StudentRequestsService],
})
export class StudentRequestsModule {}
