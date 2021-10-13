import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  twoFactorEnabled?: boolean;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  image?: string;
}
