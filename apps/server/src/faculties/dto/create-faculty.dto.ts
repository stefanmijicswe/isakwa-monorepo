import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';

export class CreateFacultyDto {
  @IsNumber()
  universityId: number;

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
  @IsString()
  deanName?: string;

  @IsOptional()
  @IsString()
  deanTitle?: string;
}
