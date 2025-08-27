import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { RequestType } from '@prisma/client';

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
}
