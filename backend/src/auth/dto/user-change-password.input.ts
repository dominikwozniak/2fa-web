import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserChangePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}
