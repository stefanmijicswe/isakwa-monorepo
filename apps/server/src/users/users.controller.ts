import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
// @UseGuards(JwtAuthGuard)  // Temporarily disabled for testing
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  // @UseGuards(JwtAuthGuard)  // Temporarily disabled for testing
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)  // Temporarily disabled for testing
  // @Roles(UserRole.ADMIN)  // Temporarily disabled for testing
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('professors')
  // @UseGuards(JwtAuthGuard, RolesGuard)  // Temporarily disabled for testing
  // @Roles(UserRole.ADMIN)  // Temporarily disabled for testing
  async getProfessors() {
    return this.usersService.findByRole(UserRole.PROFESSOR);
  }

  @Get('student-service')
  // @UseGuards(JwtAuthGuard, RolesGuard)  // Temporarily disabled for testing
  // @Roles(UserRole.ADMIN)  // Temporarily disabled for testing
  async getStudentService() {
    return this.usersService.findByRole(UserRole.STUDENT_SERVICE);
  }

  @Get('students')
  // @UseGuards(JwtAuthGuard, RolesGuard)  // Temporarily disabled for testing
  // @Roles(UserRole.ADMIN, UserRole.PROFESSOR)  // Temporarily disabled for testing
  async getStudents(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    return this.usersService.findByRole(UserRole.STUDENT, pageNum, limitNum, search);
  }
}
