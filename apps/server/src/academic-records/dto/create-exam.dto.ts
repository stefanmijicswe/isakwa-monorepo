import { IsInt, IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ExamStatus } from '@prisma/client';

export class CreateExamDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  subjectId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  examPeriodId: number;

  @IsDateString()
  examDate: string;

  @IsString()
  @IsNotEmpty()
  examTime: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  duration: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  maxPoints?: number;

  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;
}
