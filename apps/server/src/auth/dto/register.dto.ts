import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;

  // Dodatni podaci za profesore
  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  officeRoom?: string;

  // Dodatni podaci za studente
  @IsOptional()
  @IsString()
  studentIndex?: string;

  @IsOptional()
  year?: number;

  @IsOptional()
  @IsString()
  program?: string;

  // Dodatni podaci za sve korisnike
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsNumber()
  cityId?: number;

  @IsOptional()
  @IsString()
  address?: string;

  // Alias za studentIndex (indexNumber)
  @IsOptional()
  @IsString()
  indexNumber?: string;
}
