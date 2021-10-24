import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/models/user.schema';

// TODO: rename class
@ObjectType()
export class UserToken {
  @Field()
  user: User;
}
