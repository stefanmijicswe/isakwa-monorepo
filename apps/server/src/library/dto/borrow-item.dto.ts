import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

export class BorrowItemDto {
  @IsInt()
  studentId: number;

  @IsInt()
  libraryItemId: number;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
