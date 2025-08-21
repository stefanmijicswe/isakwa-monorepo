import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateEvaluationSubmissionDto {
  @IsNumber()
  instrumentId: number;

  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsNumber()
  grade?: number;

  @IsOptional()
  @IsBoolean()
  passed?: boolean;

  @IsOptional()
  @IsDateString()
  gradedAt?: string;

  @IsOptional()
  @IsNumber()
  gradedBy?: number;
}
