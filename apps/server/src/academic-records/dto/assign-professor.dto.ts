import { IsInt, IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { TeachingType } from '@prisma/client';

export class AssignProfessorDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  professorId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  subjectId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  studyProgramId: number;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsOptional()
  @IsEnum(TeachingType)
  teachingType?: TeachingType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
