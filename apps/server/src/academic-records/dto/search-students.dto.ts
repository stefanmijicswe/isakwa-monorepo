import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchStudentsDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  studentIndex?: string;

  @IsOptional()
  @IsString()
  enrollmentYear?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  minGpa?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  maxGpa?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  studyProgramId?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
