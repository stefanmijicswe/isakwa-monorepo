import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
}

bootstrap();
