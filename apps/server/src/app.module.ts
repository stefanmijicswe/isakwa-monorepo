import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TestModule } from './test/test.module';
import { FacultiesModule } from './faculties/faculties.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TestModule, FacultiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
