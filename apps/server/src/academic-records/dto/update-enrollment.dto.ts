import { PartialType } from '@nestjs/mapped-types';
import { EnrollStudentDto } from './enroll-student.dto';

export class UpdateEnrollmentDto extends PartialType(EnrollStudentDto) {}
