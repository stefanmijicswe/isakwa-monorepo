import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class CreateStudyProgramDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsString()
  directorName?: string;

  @IsOptional()
  @IsString()
  directorTitle?: string;

  @IsInt()
  @IsNotEmpty()
  facultyId: number;
}
