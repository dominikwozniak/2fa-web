import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../auth/models/user.schema';
import { Model } from 'mongoose';
import { AuthRegisterInput } from '../auth/dto/auth-register.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  public async findUserById(id: number) {
    return this.userModel.findOne({ _id: id });
  }

  public async createUser(input: AuthRegisterInput, password: string) {
    return this.userModel.create({
      ...input,
      password,
    });
  }
}
