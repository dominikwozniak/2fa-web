import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';

@ObjectType()
export class UserLogin {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  qrUrl?: string;

  @Field({ defaultValue: false })
  useAuthenticator?: boolean;
}
