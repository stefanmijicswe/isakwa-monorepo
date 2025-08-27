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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_decorator_1 = require("../auth/decorators/user.decorator");
const client_1 = require("@prisma/client");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(user) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.usersService.findById(user.id);
    }
    async getAllUsers() {
        console.log('🔍 [UsersController] getAllUsers called');
        const result = await this.usersService.findAll();
        console.log('✅ [UsersController] getAllUsers - service returned:', Array.isArray(result) ? result.length : 0, 'users');
        return result;
    }
    async getProfessors() {
        console.log('🔍 [UsersController] getProfessors called');
        const result = await this.usersService.findByRole(client_1.UserRole.PROFESSOR);
        console.log('✅ [UsersController] getProfessors - service returned:', result?.users?.length || 0, 'professors');
        return result;
    }
    async getStudentService() {
        console.log('🔍 [UsersController] getStudentService called');
        const result = await this.usersService.findByRole(client_1.UserRole.STUDENT_SERVICE);
        console.log('✅ [UsersController] getStudentService - service returned:', result?.users?.length || 0, 'student service users');
        return result;
    }
    async getStudents(page = '1', limit = '10', search) {
        console.log('🔍 [UsersController] getStudents called with:', { page, limit, search });
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        console.log('✅ [UsersController] getStudents - calling service with:', { pageNum, limitNum, search });
        const result = await this.usersService.findByRole(client_1.UserRole.STUDENT, pageNum, limitNum, search);
        console.log('✅ [UsersController] getStudents - service returned:', result?.users?.length || 0, 'students');
        return result;
    }
    async updateUser(id, updateData) {
        console.log('🔍 [UsersController] updateUser called with:', { id, updateData });
        const result = await this.usersService.updateUser(parseInt(id), updateData);
        console.log('✅ [UsersController] updateUser - service returned:', result);
        return result;
    }
    async deleteUser(id) {
        console.log('🔍 [UsersController] deleteUser called with:', { id });
        const result = await this.usersService.deleteUser(parseInt(id));
        console.log('✅ [UsersController] deleteUser - service returned:', result);
        return result;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Re-enabled JWT authentication
    ,
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard) // Re-enabled authentication and authorization
    ,
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN) // Re-enabled role-based access control
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('professors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard) // Re-enabled authentication and authorization
    ,
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN) // Re-enabled role-based access control
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfessors", null);
__decorate([
    (0, common_1.Get)('student-service'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard) // Re-enabled authentication and authorization
    ,
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN) // Re-enabled role-based access control
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getStudentService", null);
__decorate([
    (0, common_1.Get)('students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard) // Re-enabled authentication and authorization
    ,
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.PROFESSOR, client_1.UserRole.STUDENT_SERVICE) // Re-enabled role-based access control
    ,
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Re-enabled JWT authentication
    ,
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
