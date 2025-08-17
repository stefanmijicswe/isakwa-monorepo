import { Module } from '@nestjs/common';
import { StudyProgramsService } from './study-programs.service';
import { StudyProgramsController } from './study-programs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudyProgramsController],
  providers: [StudyProgramsService],
  exports: [StudyProgramsService]
})
export class StudyProgramsModule {}
