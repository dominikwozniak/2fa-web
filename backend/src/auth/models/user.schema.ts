import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthHelper } from '../auth.helper';

@Schema({
  validateBeforeSave: true,
})
@ObjectType()
export class User {
  @Field(() => ID)
  _id: number;

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

  @Prop({ minlength: 5, required: [true, 'Password is required'] })
  @Field()
  password: string;

  @Prop({ required: true, default: false })
  @Field()
  confirm: boolean;

  @Prop({ required: false, default: '' })
  @Field()
  confirmToken: string;

  @Prop({ required: false, default: '' })
  @Field()
  bio: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
