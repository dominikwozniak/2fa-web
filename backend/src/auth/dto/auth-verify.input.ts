import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthVerifyInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  token: string;
}
