import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('professors')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getProfessors() {
    return this.usersService.findByRole(UserRole.PROFESSOR);
  }

  @Get('students')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  async getStudents() {
    return this.usersService.findByRole(UserRole.STUDENT);
  }
}
