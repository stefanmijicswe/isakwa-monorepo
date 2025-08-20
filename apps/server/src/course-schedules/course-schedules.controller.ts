import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourseSchedulesService } from './course-schedules.service';
import {
  CreateCourseScheduleDto,
  UpdateCourseScheduleDto,
  CreateCourseSessionDto,
  UpdateCourseSessionDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('course-schedules')
export class CourseSchedulesController {
  constructor(private readonly courseSchedulesService: CourseSchedulesService) {}

  // Course Schedule Management Endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async createCourseSchedule(
    @Body() dto: CreateCourseScheduleDto,
    @Request() req: any,
  ) {
    return this.courseSchedulesService.createCourseSchedule(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCourseSchedules(
    @Query() filters: any,
    @Request() req: any,
  ) {
    const professorId = req.user.role === UserRole.PROFESSOR ? req.user.id : undefined;
    return this.courseSchedulesService.getCourseSchedules(filters, professorId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCourseScheduleById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const professorId = req.user.role === UserRole.PROFESSOR ? req.user.id : undefined;
    return this.courseSchedulesService.getCourseScheduleById(parseInt(id), professorId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async updateCourseSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateCourseScheduleDto,
    @Request() req: any,
  ) {
    return this.courseSchedulesService.updateCourseSchedule(parseInt(id), dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async deleteCourseSchedule(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.courseSchedulesService.deleteCourseSchedule(parseInt(id), req.user.id);
  }

  // Course Session Management Endpoints
  @Post('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async createCourseSession(
    @Body() dto: CreateCourseSessionDto,
    @Request() req: any,
  ) {
    return this.courseSchedulesService.createCourseSession(dto, req.user.id);
  }

  @Get('schedules/:scheduleId/sessions')
  @UseGuards(JwtAuthGuard)
  async getCourseSessions(
    @Param('scheduleId') scheduleId: string,
    @Request() req: any,
  ) {
    const professorId = req.user.role === UserRole.PROFESSOR ? req.user.id : undefined;
    return this.courseSchedulesService.getCourseSessions(parseInt(scheduleId), professorId);
  }

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async getCourseSessionById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const professorId = req.user.role === UserRole.PROFESSOR ? req.user.id : undefined;
    return this.courseSchedulesService.getCourseSessionById(parseInt(id), professorId);
  }

  @Put('sessions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async updateCourseSession(
    @Param('id') id: string,
    @Body() dto: UpdateCourseSessionDto,
    @Request() req: any,
  ) {
    return this.courseSchedulesService.updateCourseSession(parseInt(id), dto, req.user.id);
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async deleteCourseSession(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.courseSchedulesService.deleteCourseSession(parseInt(id), req.user.id);
  }

  // Additional Query Endpoints
  @Get('subject/:subjectId')
  @UseGuards(JwtAuthGuard)
  async getSchedulesBySubject(
    @Param('subjectId') subjectId: string,
    @Query('academicYear') academicYear?: string,
    @Query('semesterType') semesterType?: string,
  ) {
    return this.courseSchedulesService.getSchedulesBySubject(
      parseInt(subjectId),
      academicYear,
      semesterType,
    );
  }

  @Get('professor/:professorId')
  @UseGuards(JwtAuthGuard)
  async getSchedulesByProfessor(
    @Param('professorId') professorId: string,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.courseSchedulesService.getSchedulesByProfessor(
      parseInt(professorId),
      academicYear,
    );
  }

  @Get('my-schedules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async getMySchedules(
    @Request() req: any,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.courseSchedulesService.getSchedulesByProfessor(
      req.user.id,
      academicYear,
    );
  }
}
