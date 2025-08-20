import { IsNumber, IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { SemesterType } from '@prisma/client';

export class CreateCourseScheduleDto {
  @IsNumber()
  subjectId: number;

  @IsString()
  academicYear: string;

  @IsEnum(SemesterType)
  semesterType: SemesterType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
