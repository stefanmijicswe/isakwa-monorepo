import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { SemesterType } from '@prisma/client';

export class CreateExamPeriodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsDateString()
  registrationStartDate: string;

  @IsDateString()
  registrationEndDate: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsEnum(SemesterType)
  semesterType: SemesterType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
