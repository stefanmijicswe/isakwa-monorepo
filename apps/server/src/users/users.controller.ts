import { Controller, Get, Post, Put, Delete, UseGuards, Query, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserRole } from '@prisma/client';
import { CreateUserData } from './users.service';
import * as bcrypt from 'bcryptjs';

@Controller('users')
@UseGuards(JwtAuthGuard)  // Re-enabled JWT authentication
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)  // Re-enabled JWT authentication
  async getProfile(@CurrentUser() user: any) {
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.usersService.findById(user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)  // Re-enabled authentication and authorization
  @Roles(UserRole.ADMIN)  // Re-enabled role-based access control
  async getAllUsers() {
    console.log('🔍 [UsersController] getAllUsers called');
    const result = await this.usersService.findAll();
    console.log('✅ [UsersController] getAllUsers - service returned:', Array.isArray(result) ? result.length : 0, 'users');
    return result;
  }

  @Get('professors')
  @UseGuards(JwtAuthGuard, RolesGuard)  // Re-enabled authentication and authorization
  @Roles(UserRole.ADMIN)  // Re-enabled role-based access control
  async getProfessors() {
    console.log('🔍 [UsersController] getProfessors called');
    const result = await this.usersService.findByRole(UserRole.PROFESSOR);
    console.log('✅ [UsersController] getProfessors - service returned:', result?.users?.length || 0, 'professors');
    return result;
  }

  @Get('student-service')
  @UseGuards(JwtAuthGuard, RolesGuard)  // Re-enabled authentication and authorization
  @Roles(UserRole.ADMIN)  // Re-enabled role-based access control
  async getStudentService() {
    console.log('🔍 [UsersController] getStudentService called');
    const result = await this.usersService.findByRole(UserRole.STUDENT_SERVICE);
    console.log('✅ [UsersController] getStudentService - service returned:', result?.users?.length || 0, 'student service users');
    return result;
  }

  @Get('students')
  @UseGuards(JwtAuthGuard, RolesGuard)  // Re-enabled authentication and authorization
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT_SERVICE)  // Re-enabled role-based access control
  async getStudents(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    console.log('🔍 [UsersController] getStudents called with:', { page, limit, search });
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    console.log('✅ [UsersController] getStudents - calling service with:', { pageNum, limitNum, search });
    const result = await this.usersService.findByRole(UserRole.STUDENT, pageNum, limitNum, search);
    console.log('✅ [UsersController] getStudents - service returned:', result?.users?.length || 0, 'students');
    return result;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createUserData: CreateUserData) {
    console.log('🔍 [UsersController] createUser called with:', { 
      email: createUserData.email, 
      role: createUserData.role 
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserData.password || 'defaultPassword123', 12);
    
    const userData = {
      ...createUserData,
      password: hashedPassword,
    };

    const result = await this.usersService.create(userData);
    console.log('✅ [UsersController] createUser - service returned:', result?.id);
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT_SERVICE)
  async getUserById(@Param('id') id: string) {
    console.log('🔍 [UsersController] getUserById called with:', { id });
    const result = await this.usersService.findById(parseInt(id));
    console.log('✅ [UsersController] getUserById - service returned:', result?.id);
    return result;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    console.log('🔍 [UsersController] updateUser called with:', { id, updateData });
    const result = await this.usersService.updateUser(parseInt(id), updateData);
    console.log('✅ [UsersController] updateUser - service returned:', result);
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    console.log('🔍 [UsersController] deleteUser called with:', { id });
    const result = await this.usersService.deleteUser(parseInt(id));
    console.log('✅ [UsersController] deleteUser - service returned:', result);
    return result;
  }
}
