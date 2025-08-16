import { IsString, IsOptional, IsNumber, IsEmail, IsUrl } from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  addressId?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  rectorName?: string;

  @IsOptional()
  @IsString()
  rectorTitle?: string;
}
