import { IsInt, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { StudentStatus } from '@prisma/client';

export class EnrollStudentDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  studentId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  studyProgramId: number;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;
}
