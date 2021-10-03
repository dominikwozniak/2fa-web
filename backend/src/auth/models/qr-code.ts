import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class QrCode {
  @Field()
  qrUrl: string;
}
