import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BorrowingStatus } from '@prisma/client';

export class ReturnItemDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(BorrowingStatus)
  status?: BorrowingStatus = BorrowingStatus.RETURNED;
}
