import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createDocument } from './swagger/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60,
  });

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
      store: store,
      name: 'qid',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60, // 1 hour
      },
    }),
  );

  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
