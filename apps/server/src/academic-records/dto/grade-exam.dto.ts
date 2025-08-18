import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GradeExamDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  studentId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  examId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  points: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  grade?: number;

  @IsOptional()
  @IsBoolean()
  passed?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  attempt?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  gradedBy?: number;
}
