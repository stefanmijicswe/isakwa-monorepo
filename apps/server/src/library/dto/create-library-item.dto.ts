import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';
import { LibraryItemType } from '@prisma/client';

export class CreateLibraryItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsEnum(LibraryItemType)
  type: LibraryItemType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalCopies?: number = 1;
}
