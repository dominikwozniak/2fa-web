import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuthHelper } from '@/auth/auth.helper';
import { Token } from '@/user/schema/token.schema';

@Schema({
  validateBeforeSave: true,
  timestamps: true,
})
@ObjectType()
export class User {
  @Field(() => ID)
  _id: number | string;

  @Prop({
    unique: true,
    required: [true, 'Email is required'],
    validate: [AuthHelper.validateEmail, 'Bad email'],
  })
  @Field()
  email: string;

  @Prop({ required: false, default: '' })
  @Field({ nullable: true })
  firstName: string;

  @Prop({ required: false, default: '' })
  @Field({ nullable: true })
  lastName: string;

  @Prop({ required: false, default: '' })
  @Field()
  bio: string;

  @Prop({ required: false, default: '' })
  @Field()
  image: string;

  @Prop({ minlength: 5, required: [true, 'Password is required'] })
  password: string;

  @Prop({ required: true, default: false })
  @Field()
  confirm: boolean;

  @Prop({ required: false, default: false })
  @Field()
  twoFactorEnabled: boolean;

  @Prop({ required: false, default: false })
  @Field()
  afterFirstLogin: boolean;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
  })
  @Field()
  tokenId: Token;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
