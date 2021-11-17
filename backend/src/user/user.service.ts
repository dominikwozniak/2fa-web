import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Token, TokenDocument } from '@/user/schema/token.schema';
import { AuthRegisterInput } from '@/auth/dto/auth-register.input';
import {AuthHelper} from "@/auth/auth.helper";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  public async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  public async findUserByEmailWithToken(email: string) {
    return this.userModel.findOne({ email }).populate('tokenId');
  }

  // TODO: remove id as number
  public async findUserById(id: number | string) {
    return this.userModel.findOne({ _id: id });
  }

  public async findUserByIdWithToken(id: number | string) {
    return this.userModel.findOne({ _id: id }).populate('tokenId');
  }

  public async createUser(input: AuthRegisterInput) {
    const validatePassword = AuthHelper.validateInputPassword(input.password);

    if (!validatePassword) {
      throw new BadRequestException(
        `Incorrect password`,
      );
    }

    const password = await AuthHelper.hashPassword(input.password);
    const token = await this.tokenModel.create({});

    return this.userModel.create({
      ...input,
      password,
      tokenId: token._id
    });
  }

  public async findTokenById(id: string) {
    return this.tokenModel.findOne({ _id: id });
  }
}
