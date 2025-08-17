import { IsString, IsNotEmpty, IsInt, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { TeachingType } from '@prisma/client';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(30)
  credits: number;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsInt()
  @Min(0)
  lectureHours: number = 0;

  @IsInt()
  @Min(0)
  exerciseHours: number = 0;

  @IsInt()
  @IsNotEmpty()
  studyProgramId: number;
}
