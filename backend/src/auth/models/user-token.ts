import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/models/user.schema';

@ObjectType()
export class UserToken {
  @Field()
  token: string;

  @Field()
  user: User;
}
