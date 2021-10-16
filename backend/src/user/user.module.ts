import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './models/user.schema';
import { AuthHelper } from '@/auth/auth.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    AuthHelper,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
