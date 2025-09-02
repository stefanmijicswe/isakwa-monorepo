import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { RequestType, RequestCategory, NotificationPriority } from '@prisma/client';

export class CreateStudentRequestDto {
  @IsEnum(RequestType)
  @IsNotEmpty()
  type: RequestType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(RequestCategory)
  @IsOptional()
  category?: RequestCategory;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;
}
