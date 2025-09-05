import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('[JwtAuthGuard] canActivate called');
    const request = context.switchToHttp().getRequest();
    console.log('[JwtAuthGuard] Request headers:', Object.keys(request.headers));
    console.log('[JwtAuthGuard] Authorization header:', request.headers.authorization);

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('[JwtAuthGuard] handleRequest called with:', { err, user: user?.id, info });

    if (err || !user) {
      console.log('[JwtAuthGuard] Authentication failed:', { err, user, info });
      throw new UnauthorizedException('Authentication failed');
    }

    console.log('[JwtAuthGuard] Authentication successful for user:', user.id);
    return user;
  }
}
