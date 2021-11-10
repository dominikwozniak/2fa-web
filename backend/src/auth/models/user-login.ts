import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/schema/user.schema';

@ObjectType()
export class UserLogin {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  qrUrl?: string;

  @Field({ defaultValue: false })
  qrCode?: boolean;

  @Field({ defaultValue: false })
  authenticator?: boolean;
}
