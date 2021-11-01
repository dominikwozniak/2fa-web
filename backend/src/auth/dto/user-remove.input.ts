import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserRemoveInput {
  @Field()
  password: string;
}
