import { Module } from '@nestjs/common';
import { CourseSchedulesService } from './course-schedules.service';
import { CourseSchedulesController } from './course-schedules.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseSchedulesController],
  providers: [CourseSchedulesService],
  exports: [CourseSchedulesService],
})
export class CourseSchedulesModule {}
