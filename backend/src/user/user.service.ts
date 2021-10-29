import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.schema';
import { AuthRegisterInput } from '@/auth/dto/auth-register.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  public async findUserById(id: number | string) {
    return this.userModel.findOne({ _id: id });
  }

  public async createUser(input: AuthRegisterInput, password: string) {
    return this.userModel.create({
      ...input,
      password,
    });
  }
}
