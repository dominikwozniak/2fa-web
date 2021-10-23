import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createDocument } from './swagger/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  SwaggerModule.setup('api/', app, createDocument(app));

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
