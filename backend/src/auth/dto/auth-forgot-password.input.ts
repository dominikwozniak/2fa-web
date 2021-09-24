import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthForgotPasswordInput {
  @Field()
  email: string;
}
