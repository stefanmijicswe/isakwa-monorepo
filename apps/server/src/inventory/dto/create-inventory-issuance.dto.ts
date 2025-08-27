import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryIssuanceDto {
  @IsInt()
  inventoryItemId: number;

  @IsInt()
  studentId: number;

  @IsInt()
  @Min(1)
  quantityIssued: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
