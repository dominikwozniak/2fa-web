import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthChangePasswordInput {
  @Field()
  password: string;

  @Field()
  token: string;
}
