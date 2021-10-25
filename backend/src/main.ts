import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createDocument } from './swagger/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
// import * as Store from 'connect-redis';
// import { redis } from './shared/session/redis';

async function bootstrap() {
  // const RedisStore = Store(session);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  SwaggerModule.setup('api/', app, createDocument(app));

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(
    session({
      // TODO: consider using other redis hosting
      // store: new RedisStore({
      //   client: redis as any,
      // }),
      name: 'qid',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.MODE === 'production',
        maxAge: 1000 * 60 * 60,
      },
    }),
  );

  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
