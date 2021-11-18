import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { AuthHelper } from '@/auth/auth.helper';
import { User, UserSchema } from './schema/user.schema';
import { Token, TokenSchema } from '@/user/schema/token.schema';

@Module({
  imports: [
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
    AuthHelper,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
