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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        console.log('🚀 RolesGuard.canActivate() called');
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('🔍 Required roles from decorator:', requiredRoles);
        if (!requiredRoles) {
            console.log('✅ No roles required, allowing access');
            return true;
        }
        const request = context.switchToHttp().getRequest();
        console.log('🔍 Request object keys:', Object.keys(request));
        const { user } = request;
        console.log('🔍 User object from request:', user);
        console.log('🔍 User object type:', typeof user);
        console.log('🔍 User object keys:', user ? Object.keys(user) : 'NO USER');
        if (!user) {
            console.log('❌ RolesGuard: User is missing from request');
            return false;
        }
        if (!user.role) {
            console.log('❌ RolesGuard: User.role is missing');
            console.log('🔍 Available user properties:', Object.keys(user));
            return false;
        }
        console.log('🔍 User role value:', user.role);
        console.log('🔍 User role type:', typeof user.role);
        console.log('🔍 Required roles:', requiredRoles);
        console.log('🔍 Required roles type:', typeof requiredRoles);
        const hasRole = requiredRoles.includes(user.role);
        console.log('🔍 Has required role:', hasRole);
        console.log('🔍 Role comparison result:', `${user.role} in [${requiredRoles.join(', ')}] = ${hasRole}`);
        return hasRole;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
