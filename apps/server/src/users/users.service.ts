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
  departmentId?: number;
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

    // Generate unique JMBG based on user ID and timestamp
    const generateUniqueJMBG = () => {
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const userId = user.id.toString().padStart(4, '0'); // User ID padded to 4 digits
      return `${timestamp}${userId}123`; // Format: timestampuserid123
    };

    // Kreirati profil na osnovu uloge
    if (data.role === UserRole.PROFESSOR) {
      const departmentId = data.departmentId || 1;
      
      await this.prisma.professorProfile.create({
        data: {
          user: { connect: { id: user.id } },
          department: { connect: { id: departmentId } },
          title: data.title || '',
          phoneNumber: data.phoneNumber || data.phone,
          officeRoom: data.officeRoom,
          jmbg: generateUniqueJMBG(), // Unique JMBG
        },
      });

      // Automatski dodeli predmete profesoru na osnovu department-a
      await this.assignCoursesToProfessor(user.id, departmentId);
    } else if (data.role === UserRole.STUDENT) {
      await this.prisma.studentProfile.create({
        data: {
          user: { connect: { id: user.id } },
          studentIndex: data.studentIndex || data.indexNumber || '',
          year: data.year || 1,
          phoneNumber: data.phoneNumber || data.phone,
          jmbg: generateUniqueJMBG(), // Unique JMBG
        },
      });
    } else if (data.role === UserRole.STUDENT_SERVICE) {
      await this.prisma.studentServiceProfile.create({
        data: {
          user: { connect: { id: user.id } },
          department: { connect: { id: data.departmentId || 1 } }, // Default to first department
          phoneNumber: data.phoneNumber || data.phone,
          position: data.title || 'Staff Member',
          officeRoom: data.officeRoom,
        },
      });
    }

    return this.findById(user.id);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        professorProfile: {
          include: {
            department: true,
          },
        },
        studentProfile: {
          include: {
            studyProgram: {
              include: {
                faculty: true
              }
            },
          },
        },
        studentServiceProfile: {
          include: {
            department: true,
          },
        },
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
        professorProfile: {
          include: {
            department: true,
          },
        },
        studentProfile: {
          include: {
            studyProgram: {
              include: {
                faculty: true
              }
            },
          },
        },
        studentServiceProfile: {
          include: {
            department: true,
          },
        },
      },
    });
    
    console.log('🔍 UsersService.findById result:', user);
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        professorProfile: {
          include: {
            department: true,
          },
        },
        studentProfile: {
          include: {
            studyProgram: {
              include: {
                faculty: true
              }
            },
          },
        },
        studentServiceProfile: {
          include: {
            department: true,
          },
        },
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
        professorProfile: {
          include: {
            department: true,
          },
        },
        studentProfile: {
          include: {
            studyProgram: {
              include: {
                faculty: true
              }
            },
          },
        },
        studentServiceProfile: {
          include: {
            department: true,
          },
        },
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

  async updateUser(id: number, updateData: any) {
    const { firstName, lastName, email, isActive, title, departmentId, position } = updateData;
    
    // Update user basic info
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        isActive,
        updatedAt: new Date(),
      },
    });

    // Update profile based on role
    const user = await this.findById(id);
    if (user?.role === UserRole.PROFESSOR) {
      if (user.professorProfile) {
        // Update existing profile
        await this.prisma.professorProfile.update({
          where: { id: user.professorProfile.id },
          data: {
            title: title || '',
            departmentId: departmentId || 1, // Default to first department
          },
        });
      } else {
        // Create new profile if it doesn't exist
        const generateUniqueJMBG = () => {
          const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
          const userId = id.toString().padStart(4, '0'); // User ID padded to 4 digits
          return `${timestamp}${userId}123`; // Format: timestampuserid123
        };

        await this.prisma.professorProfile.create({
          data: {
            user: { connect: { id: id } },
            title: title || '',
            department: { connect: { id: departmentId || 1 } }, // Default to first department
            jmbg: generateUniqueJMBG(), // Unique JMBG
            phoneNumber: '', // Default phone
            officeRoom: '', // Default office
          },
        });
      }
    } else if (user?.role === UserRole.STUDENT_SERVICE) {
      if (user.studentServiceProfile) {
        // Update existing profile
        await this.prisma.studentServiceProfile.update({
          where: { id: user.studentServiceProfile.id },
          data: {
            position: position || '',
            departmentId: departmentId || 1, // Default to first department
          },
        });
      } else {
        // Create new profile if it doesn't exist
        await this.prisma.studentServiceProfile.create({
          data: {
            userId: id,
            position: position || '',
            departmentId: departmentId || 1, // Default to first department
          },
        });
      }
    }

    return this.findById(id);
  }

  async deleteUser(id: number) {
    // First check if user exists
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete related profiles first (due to foreign key constraints)
    if (user.professorProfile) {
      await this.prisma.professorProfile.delete({
        where: { id: user.professorProfile.id },
      });
    }

    if (user.studentProfile) {
      await this.prisma.studentProfile.delete({
        where: { id: user.studentProfile.id },
      });
    }

    if (user.studentServiceProfile) {
      await this.prisma.studentServiceProfile.delete({
        where: { id: user.studentServiceProfile.id },
      });
    }

    // Finally delete the user
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }


  private async assignCoursesToProfessor(professorId: number, departmentId: number) {
    try {
      console.log(`🎓 Assigning courses to professor ${professorId} from department ${departmentId}`);
      
      // Pronađi department i njegov faculty
      const department = await this.prisma.department.findUnique({
        where: { id: departmentId },
        include: { faculty: true }
      });

      if (!department || !department.faculty) {
        console.log(`Department ${departmentId} not found or has no faculty`);
        return;
      }

      // Pronađi sve study programe koji pripadaju tom faculty-ju
      const studyPrograms = await this.prisma.studyProgram.findMany({
        where: { facultyId: department.faculty.id }
      });

      console.log(`Found ${studyPrograms.length} study programs for faculty ${department.faculty.name}`);

      // Pronađi sve predmete koji pripadaju tim study programima
      const studyProgramIds = studyPrograms.map(sp => sp.id);
      const subjects = await this.prisma.subject.findMany({
        where: { studyProgramId: { in: studyProgramIds } }
      });

      console.log(`Found ${subjects.length} subjects for faculty`);

      // Dodeli sve predmete iz tih study programa profesoru
      const currentAcademicYear = '2024/2025';
      const assignments = [];

      for (const subject of subjects) {
          
          // Proveri da li već postoji assignment
          const existingAssignment = await this.prisma.professorAssignment.findFirst({
            where: {
              professorId,
              subjectId: subject.id,
              academicYear: currentAcademicYear,
              isActive: true
            }
          });

          if (!existingAssignment) {
            assignments.push({
              professorId,
              subjectId: subject.id,
              studyProgramId: subject.studyProgramId,
              academicYear: currentAcademicYear,
              teachingType: 'LECTURE', // Default teaching type
              isActive: true
            });
          }
      }

      if (assignments.length > 0) {
        await this.prisma.professorAssignment.createMany({
          data: assignments
        });
        console.log(`Created ${assignments.length} course assignments for professor ${professorId}`);
      } else {
        console.log(`No new assignments needed for professor ${professorId}`);
      }

    } catch (error) {
      console.error(`Error assigning courses to professor ${professorId}:`, error);
      // Ne bacaj grešku jer kreiranje korisnika ne sme da propadne zbog dodele predmeta
    }
  }
}
