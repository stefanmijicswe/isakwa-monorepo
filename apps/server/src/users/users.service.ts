import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  // Profesor podaci
  department?: string;
  title?: string;
  phoneNumber?: string;
  officeRoom?: string;
  // Student podaci
  studentIndex?: string;
  year?: number;
  program?: string;
  // Dodatni podaci za sve korisnike
  phone?: string;
  dateOfBirth?: string;
  cityId?: number;
  address?: string;
  indexNumber?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserData) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      },
    });

    // Kreirati profil na osnovu uloge
    if (data.role === UserRole.PROFESSOR) {
      await this.prisma.professorProfile.create({
        data: {
          userId: user.id,
          department: data.department || '',
          title: data.title || '',
          phoneNumber: data.phoneNumber || data.phone,
          officeRoom: data.officeRoom,
        },
      });
    } else if (data.role === UserRole.STUDENT) {
      await this.prisma.studentProfile.create({
        data: {
          userId: user.id,
          studentIndex: data.studentIndex || data.indexNumber || '',
          year: data.year || 1,
          phoneNumber: data.phoneNumber || data.phone,
        },
      });
    }

    return this.findById(user.id);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        professorProfile: true,
        studentProfile: true,
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        professorProfile: true,
        studentProfile: true,
      },
    });
    
    console.log('🔍 UsersService.findById result:', user);
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        professorProfile: true,
        studentProfile: true,
      },
    });
  }

  async findByRole(role: UserRole, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = { role };
    
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { studentProfile: { studentIndex: { contains: search } } },
      ];
    }

    // Get total count for pagination
    const total = await this.prisma.user.count({ where });
    
    // Get paginated results
    const users = await this.prisma.user.findMany({
      where,
      include: {
        professorProfile: true,
        studentProfile: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
