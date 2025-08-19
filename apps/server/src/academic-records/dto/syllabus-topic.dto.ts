import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateSyllabusTopicDto {
  @IsNotEmpty()
  @IsNumber()
  syllabusId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(52)
  weekNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  order: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSyllabusTopicDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(52)
  weekNumber?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
