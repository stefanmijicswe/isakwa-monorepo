import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryItemDto } from './create-inventory-item.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateInventoryItemDto extends PartialType(CreateInventoryItemDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
