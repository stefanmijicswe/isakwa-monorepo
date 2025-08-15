import { Module } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { FacultiesController } from './faculties.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FacultiesService],
  controllers: [FacultiesController],
  exports: [FacultiesService]
})
export class FacultiesModule {}
