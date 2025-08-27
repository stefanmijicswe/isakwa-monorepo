"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
        if (data.role === client_1.UserRole.PROFESSOR) {
            await this.prisma.professorProfile.create({
                data: {
                    userId: user.id,
                    departmentId: data.departmentId || 1, // Default to first department
                    title: data.title || '',
                    phoneNumber: data.phoneNumber || data.phone,
                    officeRoom: data.officeRoom,
                },
            });
        }
        else if (data.role === client_1.UserRole.STUDENT) {
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
    async findByEmail(email) {
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
    async findById(id) {
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
    async findByRole(role, page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        // Build where clause
        const where = { role };
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
    async updateUser(id, updateData) {
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
        if (user?.role === client_1.UserRole.PROFESSOR) {
            if (user.professorProfile) {
                // Update existing profile
                await this.prisma.professorProfile.update({
                    where: { id: user.professorProfile.id },
                    data: {
                        title: title || '',
                        departmentId: departmentId || 1, // Default to first department
                    },
                });
            }
            else {
                // Create new profile if it doesn't exist
                await this.prisma.professorProfile.create({
                    data: {
                        userId: id,
                        title: title || '',
                        departmentId: departmentId || 1, // Default to first department
                    },
                });
            }
        }
        else if (user?.role === client_1.UserRole.STUDENT_SERVICE) {
            if (user.studentServiceProfile) {
                // Update existing profile
                await this.prisma.studentServiceProfile.update({
                    where: { id: user.studentServiceProfile.id },
                    data: {
                        position: position || '',
                        departmentId: departmentId || 1, // Default to first department
                    },
                });
            }
            else {
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
    async deleteUser(id) {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
