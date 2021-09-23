import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { User, UserDocument } from './models/user.schema';
import { Model } from 'mongoose';
import { AuthLoginInput } from './dto/auth-login.input';
import { UserToken } from './models/user-token';
import { AuthRegisterInput } from './dto/auth-register.input';
import { AuthHelper } from './auth.helper';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from './dto/jwt.dto';
import { AuthConfirmInput } from './dto/auth-confirm.input';
import { sendEmail } from "../shared/sendEmail";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  public async login(input: AuthLoginInput): Promise<UserToken> {
    const found = await this.userModel.findOne({ email: input.email });

    if (!found) {
      throw new NotFoundException(
        `User with email ${input.email} does not exist`,
      );
    }

    const passwordValid = await AuthHelper.validatePassword(
      input.password,
      found.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!found.confirm) {
      throw new BadRequestException('User is not active');
    }

    return {
      user: found,
      token: this.signToken(found.id),
    };
  }

  public async register(input: AuthRegisterInput): Promise<UserToken> {
    const found = await this.userModel.findOne({ email: input.email });

    if (found) {
      throw new BadRequestException(
        `Cannot register with email ${input.email}`,
      );
    }

    const hashedPassword = await AuthHelper.hashPassword(input.password);
    const token = nanoid(32);

    const created = await this.userModel.create({
      ...input,
      password: hashedPassword,
      confirmToken: token,
    });

    if (created) {
      const url = AuthHelper.createConfirmationUrl(token)
      await sendEmail(created.email, url)
    }

    return {
      user: created,
      token: this.signToken(created.id),
    };
  }

  public async confirmAccount(input: AuthConfirmInput): Promise<User> {
    const user = await this.userModel.findOne({ email: input.email });

    if (!user || input.confirmToken !== user.confirmToken) {
      throw new BadRequestException(
        `Cannot confirm user with email ${input.email}`,
      );
    }

    user.confirm = true;
    await user.save();

    return user;
  }

  // public async changePassword(input: AuthChangePasswordInput): Promise<User> {
  //
  // }

  public signToken(id: number) {
    const payload: JwtDto = { userId: id };

    return this.jwtService.sign(payload);
  }

  public async validateUser(userId: number) {
    return this.userModel.findOne({ _id: userId });
  }
}
