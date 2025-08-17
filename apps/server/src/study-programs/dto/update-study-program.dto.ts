import { PartialType } from '@nestjs/mapped-types';
import { CreateStudyProgramDto } from './create-study-program.dto';

export class UpdateStudyProgramDto extends PartialType(CreateStudyProgramDto) {}
