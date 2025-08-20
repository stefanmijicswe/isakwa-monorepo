import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';
import { InventoryCategory } from '@prisma/client';

export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minStock?: number = 0;
}
