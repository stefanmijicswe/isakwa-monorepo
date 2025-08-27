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
exports.StudentRequestsController = void 0;
const common_1 = require("@nestjs/common");
const student_requests_service_1 = require("./student-requests.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let StudentRequestsController = class StudentRequestsController {
    constructor(studentRequestsService) {
        this.studentRequestsService = studentRequestsService;
    }
    async createRequest(createRequestDto, req) {
        return this.studentRequestsService.createRequest(createRequestDto, req.user.id);
    }
    async findAllRequests(req, page = 1, limit = 10) {
        return this.studentRequestsService.findAllRequests(req.user.id, req.user.role, page, limit);
    }
    async findRequestById(id, req) {
        return this.studentRequestsService.findRequestById(id, req.user.id, req.user.role);
    }
    async updateRequestStatus(id, updateStatusDto, req) {
        return this.studentRequestsService.updateRequestStatus(id, updateStatusDto, req.user.id, req.user.role);
    }
    async addComment(id, createCommentDto, req) {
        return this.studentRequestsService.addComment(id, createCommentDto, req.user.id, req.user.role);
    }
    async getRequestComments(id, req) {
        return this.studentRequestsService.getRequestComments(id, req.user.id, req.user.role);
    }
    async getRequestAttachments(id, req) {
        return this.studentRequestsService.getRequestAttachments(id, req.user.id, req.user.role);
    }
    async deleteRequest(id, req) {
        return this.studentRequestsService.deleteRequest(id, req.user.id, req.user.role);
    }
};
exports.StudentRequestsController = StudentRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateStudentRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT, client_1.UserRole.STUDENT_SERVICE, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "findAllRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT, client_1.UserRole.STUDENT_SERVICE, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "findRequestById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT_SERVICE, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateRequestStatusDto, Object]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "updateRequestStatus", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT, client_1.UserRole.STUDENT_SERVICE, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT, client_1.UserRole.STUDENT_SERVICE, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "getRequestComments", null);
__decorate([
    (0, common_1.Get)(':id/attachments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT, client_1.UserRole.STUDENT_SERVICE, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "getRequestAttachments", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StudentRequestsController.prototype, "deleteRequest", null);
exports.StudentRequestsController = StudentRequestsController = __decorate([
    (0, common_1.Controller)('student-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_requests_service_1.StudentRequestsService])
], StudentRequestsController);
