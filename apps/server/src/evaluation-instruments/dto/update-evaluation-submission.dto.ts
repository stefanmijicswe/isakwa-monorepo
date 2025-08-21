import { IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class UpdateEvaluationSubmissionDto {
  @IsOptional()
  @IsNumber()
  instrumentId?: number;

  @IsOptional()
  @IsNumber()
  studentId?: number;

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
