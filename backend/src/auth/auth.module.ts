import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User, UserSchema } from './models/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { AuthHelper } from './auth.helper';

@Module({
  imports: [
    RedisModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '3600s',
      },
    }),
  ],
  providers: [AuthResolver, AuthService, AuthHelper, JwtStrategy, GqlAuthGuard],
  exports: [AuthHelper],
})
export class AuthModule {}
