import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthConfirmInput {
  @Field()
  email: string;

  @Field()
  confirmToken: string;
}
