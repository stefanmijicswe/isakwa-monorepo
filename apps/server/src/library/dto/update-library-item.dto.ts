import { PartialType } from '@nestjs/mapped-types';
import { CreateLibraryItemDto } from './create-library-item.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateLibraryItemDto extends PartialType(CreateLibraryItemDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
