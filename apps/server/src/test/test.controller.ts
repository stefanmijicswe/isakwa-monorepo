import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserRole } from '@prisma/client';

@Controller('test')
export class TestController {
  
  @Get('public')
  getPublicData() {
    return {
      message: 'Ovo je javni endpoint - dostupan svima',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData(@CurrentUser() user: any) {
    return {
      message: 'Ovo je zaštićeni endpoint - dostupan samo ulogovanim korisnicima',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminData(@CurrentUser() user: any) {
    return {
      message: 'Ovo je admin endpoint - dostupan samo administratorima',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
      adminFeatures: [
        'Upravljanje korisnicima',
        'Sistemske postavke',
        'Izveštaji'
      ]
    };
  }

  @Get('professor-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESOR)
  getProfessorData(@CurrentUser() user: any) {
    return {
      message: 'Ovo je profesor endpoint - dostupan samo profesorima',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
      professorFeatures: [
        'Upravljanje kursevima',
        'Ocene studenata',
        'Kreiranje ispita'
      ]
    };
  }

  @Get('student-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  getStudentData(@CurrentUser() user: any) {
    return {
      message: 'Ovo je student endpoint - dostupan samo studentima',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
      studentFeatures: [
        'Pregled kurseva',
        'Ocene',
        'Raspored časova'
      ]
    };
  }

  @Get('professor-or-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESOR, UserRole.ADMIN)
  getProfessorOrAdminData(@CurrentUser() user: any) {
    return {
      message: 'Ovo je endpoint dostupan profesorima i administratorima',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
      sharedFeatures: [
        'Napredne funkcionalnosti',
        'Pristup podacima o studentima',
        'Izveštaji'
      ]
    };
  }
}
