import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentRequestsService } from './student-requests.service';
import { CreateStudentRequestDto, UpdateRequestStatusDto, CreateCommentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('student-requests')
@UseGuards(JwtAuthGuard)
export class StudentRequestsController {
  constructor(private readonly studentRequestsService: StudentRequestsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  async createRequest(@Body() createRequestDto: CreateStudentRequestDto, @Request() req) {
    return this.studentRequestsService.createRequest(createRequestDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async findAllRequests(
    @Request() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.studentRequestsService.findAllRequests(req.user.id, req.user.role, page, limit);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async findRequestById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.studentRequestsService.findRequestById(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async updateRequestStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateRequestStatusDto,
    @Request() req,
  ) {
    return this.studentRequestsService.updateRequestStatus(id, updateStatusDto, req.user.id, req.user.role);
  }

  @Post(':id/comments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.studentRequestsService.addComment(id, createCommentDto, req.user.id, req.user.role);
  }

  @Get(':id/comments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async getRequestComments(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.studentRequestsService.getRequestComments(id, req.user.id, req.user.role);
  }

  @Get(':id/attachments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async getRequestAttachments(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.studentRequestsService.getRequestAttachments(id, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  async deleteRequest(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.studentRequestsService.deleteRequest(id, req.user.id, req.user.role);
  }
}
