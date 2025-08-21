import { IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { EvaluationType } from '@prisma/client';

export class UpdateEvaluationInstrumentDto {
  @IsOptional()
  @IsNumber()
  subjectId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EvaluationType)
  type?: EvaluationType;

  @IsOptional()
  @IsNumber()
  maxPoints?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
