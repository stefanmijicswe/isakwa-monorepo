import { IsOptional, IsString } from 'class-validator';

export class MarkAsReturnedDto {
  @IsOptional()
  @IsString()
  returnNotes?: string;
}
