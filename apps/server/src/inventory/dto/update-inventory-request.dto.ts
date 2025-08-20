import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InventoryRequestStatus } from '@prisma/client';

export class UpdateInventoryRequestDto {
  @IsEnum(InventoryRequestStatus)
  status: InventoryRequestStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
