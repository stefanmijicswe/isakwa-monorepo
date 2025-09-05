import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { SemesterType } from '@prisma/client';

export class CreateSyllabusDto {
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;

  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @IsNotEmpty()
  @IsEnum(SemesterType)
  semesterType: SemesterType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  objectives: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSyllabusDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  objectives?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetSyllabusDto {
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
  @IsNumber()
  subjectId?: number;

  @IsOptional()
  @IsString()
  academicYear?: string;

  @IsOptional()
  @IsEnum(SemesterType)
  semesterType?: SemesterType;
}
