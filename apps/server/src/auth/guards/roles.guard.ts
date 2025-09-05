import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('🚀 RolesGuard.canActivate() called');
    
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    console.log('🔍 Required roles from decorator:', requiredRoles);
    
    if (!requiredRoles) {
      console.log('No roles required, allowing access');
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    console.log('Request object keys:', Object.keys(request));
    
    const { user } = request;
    console.log('User object from request:', user);
    console.log('User object type:', typeof user);
    console.log('User object keys:', user ? Object.keys(user) : 'NO USER');
    
    if (!user) {
      console.log('RolesGuard: User is missing from request');
      return false;
    }
    
    if (!user.role) {
      console.log('RolesGuard: User.role is missing');
      console.log('Available user properties:', Object.keys(user));
      return false;
    }
    
    console.log('User role value:', user.role);
    console.log('User role type:', typeof user.role);
    console.log('Required roles:', requiredRoles);
    console.log('Required roles type:', typeof requiredRoles);
    
    const hasRole = requiredRoles.includes(user.role);
    console.log('Has required role:', hasRole);
    console.log('Role comparison result:', `${user.role} in [${requiredRoles.join(', ')}] = ${hasRole}`);
    
    return hasRole;
  }
}
