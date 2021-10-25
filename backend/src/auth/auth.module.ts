import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User, UserSchema } from '@/user/models/user.schema';
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
    ]),
  ],
  providers: [AuthResolver, AuthService, AuthHelper],
  exports: [AuthHelper],
})
export class AuthModule {}
