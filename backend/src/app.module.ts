import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
      },
    ),
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
