import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🔍 JwtStrategy.validate() called with payload:', payload);
    
    const user = await this.authService.validateUser(payload.sub);
    console.log('🔍 JwtStrategy.validate() - user from authService:', user);
    
    if (!user) {
      console.log('❌ JwtStrategy.validate() - user not found');
      throw new UnauthorizedException();
    }
    
    console.log('✅ JwtStrategy.validate() - returning user:', user);
    return user;
  }
}
