import { Module } from '@nestjs/common';
import { EvaluationInstrumentsService } from './evaluation-instruments.service';
import { EvaluationInstrumentsController } from './evaluation-instruments.controller';
import { EvaluationExportService } from './evaluation-export.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvaluationInstrumentsController],
  providers: [EvaluationInstrumentsService, EvaluationExportService],
  exports: [EvaluationInstrumentsService, EvaluationExportService],
})
export class EvaluationInstrumentsModule {}
