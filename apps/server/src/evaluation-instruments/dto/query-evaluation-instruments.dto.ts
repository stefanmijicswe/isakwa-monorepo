import { IsOptional, IsString } from 'class-validator';

export class QueryEvaluationInstrumentsDto {
  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  isActive?: string;
}

export class QueryEvaluationSubmissionsDto {
  @IsOptional()
  @IsString()
  instrumentId?: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsString()
  passed?: string;
}
