import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserChangeEmailInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
