import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryRequestDto {
  @IsInt()
  inventoryItemId: number;

  @IsInt()
  @Min(1)
  quantityRequested: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
