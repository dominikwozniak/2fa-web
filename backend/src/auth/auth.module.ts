import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User, UserSchema } from '@/user/schema/user.schema';
import { Token, TokenSchema } from '@/user/schema/token.schema';
import { RedisModule } from '@/redis/redis.module';
import { UserModule } from '@/user/user.module';
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
      {
        name: Token.name,
        schema: TokenSchema
      }
    ]),
  ],
  providers: [AuthResolver, AuthService, AuthHelper],
  exports: [AuthHelper],
})
export class AuthModule {}
