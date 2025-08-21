import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { EvaluationType } from '@prisma/client';

export class CreateEvaluationInstrumentDto {
  @IsNumber()
  subjectId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EvaluationType)
  type: EvaluationType;

  @IsNumber()
  maxPoints: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
