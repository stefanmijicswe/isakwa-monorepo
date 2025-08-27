"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Učitaj .env fajl pre bilo čega drugog
// Fallback za DATABASE_URL ako nije postavljena
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./prisma/dev.db';
}
// Fallback za JWT_SECRET ako nije postavljena
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'fallback-jwt-secret-key-for-development-only';
    console.warn('⚠️  Using fallback JWT_SECRET. Set JWT_SECRET environment variable for production!');
}
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_minimal_module_1 = require("./app-minimal.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_minimal_module_1.AppMinimalModule);
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Enable CORS
    app.enableCors({
        origin: true,
        credentials: true,
    });
    await app.listen(3001);
    console.log('🚀 Minimal server running on http://localhost:3001');
}
bootstrap();
