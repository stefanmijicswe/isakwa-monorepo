import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TestModule } from './test/test.module';
import { FacultiesModule } from './faculties/faculties.module';
import { UniversitiesModule } from './universities/universities.module';
import { StudyProgramsModule } from './study-programs/study-programs.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AcademicRecordsModule } from './academic-records/academic-records.module';
import { LibraryModule } from './library/library.module';
import { InventoryModule } from './inventory/inventory.module';
import { CourseSchedulesModule } from './course-schedules/course-schedules.module';
import { EvaluationInstrumentsModule } from './evaluation-instruments/evaluation-instruments.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    TestModule, 
    FacultiesModule,
    UniversitiesModule,
    StudyProgramsModule,
    SubjectsModule,
    AcademicRecordsModule,
    LibraryModule,
    InventoryModule,
    CourseSchedulesModule,
    EvaluationInstrumentsModule,
    DepartmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
