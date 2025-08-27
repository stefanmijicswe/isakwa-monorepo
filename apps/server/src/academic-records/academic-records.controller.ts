import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AcademicRecordsService } from './academic-records.service';
import {
  EnrollStudentDto,
  EnrollCourseDto,
  AssignProfessorDto,
  RegisterExamDto,
  CreateExamPeriodDto,
  CreateExamDto,
  GradeExamDto,
  SearchStudentsDto,
  UpdateEnrollmentDto,
  CreateSyllabusDto,
  UpdateSyllabusDto,
  GetSyllabusDto,
  CreateSyllabusTopicDto,
  UpdateSyllabusTopicDto,
  CreateSyllabusMaterialDto,
  UpdateSyllabusMaterialDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('academic-records')
export class AcademicRecordsController {
  constructor(private readonly academicRecordsService: AcademicRecordsService) {}

  @Post('enroll-student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  enrollStudent(@Body() enrollStudentDto: EnrollStudentDto) {
    return this.academicRecordsService.enrollStudent(enrollStudentDto);
  }

  @Post('enroll-course')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.STUDENT_SERVICE)
  enrollInCourse(@Body() enrollCourseDto: EnrollCourseDto, @Request() req) {
    if (req.user.role === UserRole.STUDENT) {
      if (req.user.studentProfile?.id !== enrollCourseDto.studentId) {
        throw new BadRequestException('Students can only enroll themselves');
      }
    }
    return this.academicRecordsService.enrollInCourse(enrollCourseDto);
  }

  @Post('assign-professor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  assignProfessor(@Body() assignProfessorDto: AssignProfessorDto) {
    return this.academicRecordsService.assignProfessor(assignProfessorDto);
  }

  @Post('exam-periods')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  createExamPeriod(@Body() createExamPeriodDto: CreateExamPeriodDto) {
    return this.academicRecordsService.createExamPeriod(createExamPeriodDto);
  }

  @Post('exams')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  createExam(@Body() createExamDto: CreateExamDto) {
    return this.academicRecordsService.createExam(createExamDto);
  }

  @Get('exams')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN, UserRole.PROFESSOR)
  getExams() {
    return this.academicRecordsService.getExams();
  }

  @Post('register-exam')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  registerForExam(@Body() registerExamDto: RegisterExamDto, @Request() req) {
    if (req.user.studentProfile?.id !== registerExamDto.studentId) {
      throw new BadRequestException('Students can only register themselves for exams');
    }
    return this.academicRecordsService.registerForExam(registerExamDto);
  }

  @Post('grade-exam')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  gradeExam(@Body() gradeExamDto: GradeExamDto, @Request() req) {
    gradeExamDto.gradedBy = req.user.id;
    return this.academicRecordsService.gradeExam(gradeExamDto);
  }

  @Get('students/search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  searchStudents(@Query() searchStudentsDto: SearchStudentsDto) {
    return this.academicRecordsService.searchStudents(searchStudentsDto);
  }

  @Get('students/:id/academic-history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  getStudentAcademicHistory(@Param('id') id: string, @Request() req) {
    const studentId = parseInt(id);
    
    if (req.user.role === UserRole.STUDENT) {
      if (req.user.studentProfile?.id !== studentId) {
        throw new BadRequestException('Students can only view their own academic history');
      }
    }
    
    return this.academicRecordsService.getStudentAcademicHistory(studentId);
  }

  @Get('professors/:id/subjects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  getProfessorSubjects(
    @Param('id') id: string,
    @Query('academicYear') academicYear?: string,
    @Request() req?
  ) {
    const professorId = parseInt(id);
    
    if (req.user.role === UserRole.PROFESSOR) {
      if (req.user.id !== professorId) {
        throw new BadRequestException('Professors can only view their own subjects');
      }
    }
    
    return this.academicRecordsService.getProfessorSubjects(professorId, academicYear);
  }

  @Get('exam-periods')
  getActiveExamPeriods() {
    return this.academicRecordsService.getActiveExamPeriods();
  }

  @Get('my-academic-history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  getMyAcademicHistory(@Request() req) {
    if (!req.user.studentProfile) {
      throw new BadRequestException('Student profile not found');
    }
    return this.academicRecordsService.getStudentAcademicHistory(req.user.studentProfile.id);
  }

  @Get('my-subjects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  getMySubjects(@Request() req, @Query('academicYear') academicYear?: string) {
    return this.academicRecordsService.getProfessorSubjects(req.user.id, academicYear);
  }

  @Get('current-enrollments/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async getCurrentEnrollments(@Param('studentId') studentId: string, @Request() req) {
    const id = parseInt(studentId);
    
    if (req.user.role === UserRole.STUDENT) {
      if (req.user.studentProfile?.id !== id) {
        throw new BadRequestException('Students can only view their own enrollments');
      }
    }
    
    const history = await this.academicRecordsService.getStudentAcademicHistory(id);
    return {
      currentCourses: history.currentEnrollments,
      examRegistrations: history.examRegistrations,
    };
  }

  @Get('notifications/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async getStudentNotifications(@Param('studentId') studentId: string, @Request() req) {
    const id = parseInt(studentId);
    
    if (req.user.studentProfile?.id !== id) {
      throw new BadRequestException('Students can only view their own notifications');
    }

    const examPeriods = await this.academicRecordsService.getActiveExamPeriods();
    const history = await this.academicRecordsService.getStudentAcademicHistory(id);
    
    return {
      activeExamPeriods: examPeriods,
      upcomingExams: history.examRegistrations.filter(reg => 
        new Date(reg.exam.examDate) > new Date()
      ),
      currentCourses: history.currentEnrollments,
    };
  }

  @Get('exam-registrations/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async getStudentExamRegistrations(@Param('studentId') studentId: string, @Request() req) {
    const id = parseInt(studentId);
    
    if (req.user.studentProfile?.id !== id) {
      throw new BadRequestException('Students can only view their own exam registrations');
    }

    return this.academicRecordsService.getStudentExamRegistrations(id);
  }

  // Syllabus Management Endpoints
  @Post('syllabus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async createSyllabus(
    @Body() dto: CreateSyllabusDto,
    @Request() req: any,
  ) {
    return this.academicRecordsService.createSyllabus(dto, req.user.id);
  }

  @Put('syllabus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async updateSyllabus(
    @Param('id') id: string,
    @Body() dto: UpdateSyllabusDto,
    @Request() req: any,
  ) {
    return this.academicRecordsService.updateSyllabus(parseInt(id), dto, req.user.id);
  }

  @Get('syllabus')
  @UseGuards(JwtAuthGuard)
  async getSyllabus(
    @Query() filters: GetSyllabusDto,
    @Request() req: any,
  ) {
    const professorId = req.user.role === UserRole.PROFESSOR ? req.user.id : undefined;
    return this.academicRecordsService.getSyllabus(filters, professorId);
  }

  @Get('syllabus/:id')
  @UseGuards(JwtAuthGuard)
  async getSyllabusById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const professorId = req.user.role === UserRole.PROFESSOR ? req.user.id : undefined;
    return this.academicRecordsService.getSyllabusById(parseInt(id), professorId);
  }

  @Delete('syllabus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async deleteSyllabus(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.academicRecordsService.deleteSyllabus(parseInt(id), req.user.id);
  }

  // Syllabus Topic Management Endpoints
  @Post('syllabus/topic')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async createSyllabusTopic(
    @Body() dto: CreateSyllabusTopicDto,
    @Request() req: any,
  ) {
    return this.academicRecordsService.createSyllabusTopic(dto, req.user.id);
  }

  @Put('syllabus/topic/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async updateSyllabusTopic(
    @Param('id') id: string,
    @Body() dto: UpdateSyllabusTopicDto,
    @Request() req: any,
  ) {
    return this.academicRecordsService.updateSyllabusTopic(parseInt(id), dto, req.user.id);
  }

  @Delete('syllabus/topic/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async deleteSyllabusTopic(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.academicRecordsService.deleteSyllabusTopic(parseInt(id), req.user.id);
  }

  // Syllabus Material Management Endpoints
  @Post('syllabus/material')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async createSyllabusMaterial(
    @Body() dto: CreateSyllabusMaterialDto,
    @Request() req: any,
  ) {
    return this.academicRecordsService.createSyllabusMaterial(dto, req.user.id);
  }

  @Put('syllabus/material/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async updateSyllabusMaterial(
    @Param('id') id: string,
    @Body() dto: UpdateSyllabusMaterialDto,
    @Request() req: any,
  ) {
    return this.academicRecordsService.updateSyllabusMaterial(parseInt(id), dto, req.user.id);
  }

  @Delete('syllabus/material/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async deleteSyllabusMaterial(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.academicRecordsService.deleteSyllabusMaterial(parseInt(id), req.user.id);
  }
}
