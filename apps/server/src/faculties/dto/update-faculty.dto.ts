import { PartialType } from '@nestjs/mapped-types';
import { CreateFacultyDto } from './create-faculty.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateFacultyDto extends PartialType(
  OmitType(CreateFacultyDto, ['universityId'] as const)
) {}
