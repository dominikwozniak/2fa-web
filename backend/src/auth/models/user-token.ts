import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/schema/user.schema';

// TODO: rename class
@ObjectType()
export class UserToken {
  @Field()
  user: User;
}
