import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterExamDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  studentId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  examId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
