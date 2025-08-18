import { IsInt, IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { SemesterType } from '@prisma/client';

export class EnrollCourseDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  studentId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  subjectId: number;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsEnum(SemesterType)
  semesterType: SemesterType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
