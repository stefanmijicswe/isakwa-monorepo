import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RdfModule } from '../rdf/rdf.module';

@Module({
  imports: [PrismaModule, RdfModule],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
