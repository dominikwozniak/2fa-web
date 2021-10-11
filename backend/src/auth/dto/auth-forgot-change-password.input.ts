import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthForgotChangePasswordInput {
  @Field()
  password: string;

  @Field()
  token: string;
}
