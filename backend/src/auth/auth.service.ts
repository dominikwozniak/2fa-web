import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { User, UserDocument } from './models/user.schema';
import { Model } from 'mongoose';
import { AuthLoginInput } from './dto/auth-login.input';
import { UserToken } from './models/user-token';
import { AuthRegisterInput } from './dto/auth-register.input';
import { AuthHelper } from './auth.helper';
import { JwtDto } from './dto/jwt.dto';
import { AuthConfirmInput } from './dto/auth-confirm.input';
import { sendEmail } from '../shared/sendEmail';
import { RedisService } from '../redis/redis.service';
import { AuthForgotPasswordInput } from "./dto/auth-forgot-password.input";
import { confirmUserPrefix, forgotPasswordPrefix } from "../shared/consts/redisPrefixed.const";
import { AuthChangePasswordInput } from "./dto/auth-change-password.input";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
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

    const created = await this.userModel.create({
      ...input,
      password: hashedPassword,
    });

    if (created) {
      const token = nanoid(32);
      const saveToken = confirmUserPrefix + token;
      const url = AuthHelper.createConfirmUserUrl(token);
      await sendEmail(created.email, url);
      await this.redisService.setValue(saveToken, created._id);
    }

    return {
      user: created,
      token: this.signToken(created.id),
    };
  }

  public async confirmAccount(input: AuthConfirmInput): Promise<Boolean> {
    const token = confirmUserPrefix + input.confirmToken;
    const userId = await this.redisService.getValue(token);
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      return false;
    }

    user.confirm = true;
    await user.save();
    await this.redisService.delete(token);

    return true;
  }

  public async forgotPassword(input: AuthForgotPasswordInput): Promise<Boolean> {
    const user = await this.userModel.findOne({ email: input.email });

    if (!user) {
      return false;
    }

    const token = nanoid(32);
    const saveToken = forgotPasswordPrefix + token;
    const url = AuthHelper.createForgotPasswordUrl(token);
    await sendEmail(user.email, url)
    await this.redisService.setValue(saveToken, user._id)

    return true;
  }

  public async changePassword(input: AuthChangePasswordInput): Promise<UserToken> {
    const token = forgotPasswordPrefix + input.token;
    const userId = await this.redisService.getValue(token);

    if (!userId) {
      throw new BadRequestException(
        `Cannot change password`,
      );
    }

    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new BadRequestException(
        `Cannot change password`,
      );
    }

    await this.redisService.delete(token);
    const hashedPassword = await AuthHelper.hashPassword(input.password);

    user.password = hashedPassword;
    await user.save();

    return {
      user,
      token: this.signToken(user.id),
    };
  }

  public signToken(id: number) {
    const payload: JwtDto = { userId: id };

    return this.jwtService.sign(payload);
  }

  public async validateUser(userId: number) {
    return this.userModel.findOne({ _id: userId });
  }
}
