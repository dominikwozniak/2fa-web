import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  validateBeforeSave: true,
  timestamps: true,
})
@ObjectType()
export class Token {
  @Field(() => ID)
  _id: string;

  @Prop({ required: false, default: '' })
  @Field()
  twoFactorToken: string
}

export type TokenDocument = Token & Document;

export const TokenSchema = SchemaFactory.createForClass(Token);
