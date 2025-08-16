import { config } from 'dotenv';
config(); // Učitaj .env fajl pre bilo čega drugog

// Fallback za DATABASE_URL ako nije postavljena
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

// Fallback za JWT_SECRET ako nije postavljena
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-jwt-secret-key-for-development-only';
  console.warn('⚠️  Using fallback JWT_SECRET. Set JWT_SECRET environment variable for production!');
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://192.168.100.12:3000',
      'http://192.168.100.12:3001'
    ],
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(`📚 API documentation: http://localhost:${port}/api`);
  console.log(`🔐 Auth endpoints: http://localhost:${port}/api/auth/login | http://localhost:${port}/api/auth/register`);
}

bootstrap();
