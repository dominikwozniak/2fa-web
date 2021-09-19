import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsEmail } from 'class-validator';
import { classToPlain, Exclude } from "class-transformer";
import * as bcrypt from 'bcryptjs';

@ObjectType()
@Entity('users')
export class UserModel {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsEmail()
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column()
  @Exclude()
  password: string;

  @Field()
  @Column({ default: '' })
  bio: string;

  @Field()
  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  // serialize class -> return object without excluded fields
  toJSON() {
    return classToPlain(this);
  }
}
