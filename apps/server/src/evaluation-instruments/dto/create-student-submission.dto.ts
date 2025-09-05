import { IsNumber } from 'class-validator';

export class CreateStudentSubmissionDto {
  @IsNumber()
  instrumentId: number;
}
