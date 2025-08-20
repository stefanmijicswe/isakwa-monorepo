import { IsNumber, IsString, IsEnum, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { TeachingType } from '@prisma/client';

export class CreateCourseSessionDto {
  @IsNumber()
  scheduleId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  sessionDate: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsEnum(TeachingType)
  sessionType: TeachingType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
