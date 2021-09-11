import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createDocument } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  SwaggerModule.setup('api/', app, createDocument(app));

  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
