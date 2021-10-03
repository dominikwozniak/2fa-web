import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthConfirmInput {
  @Field()
  confirmToken: string;
}
