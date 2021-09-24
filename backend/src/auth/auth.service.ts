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
    const token = confirmUserPrefix + nanoid(32);

    const created = await this.userModel.create({
      ...input,
      password: hashedPassword,
    });

    if (created) {
      const url = AuthHelper.createConfirmUserUrl(token);
      await sendEmail(created.email, url);
      await this.redisService.setValue(token, created._id);
    }

    return {
      user: created,
      token: this.signToken(created.id),
    };
  }

  public async confirmAccount(input: AuthConfirmInput): Promise<Boolean> {
    const userId = await this.redisService.getValue(input.confirmToken);
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      return false;
    }

    user.confirm = true;
    await user.save();
    await this.redisService.delete(input.confirmToken);

    return true;
  }

  public async forgotPassword(input: AuthForgotPasswordInput): Promise<Boolean> {
    const user = await this.userModel.findOne({ email: input.email });

    if (!user) {
      return false;
    }

    const token = forgotPasswordPrefix + nanoid(32);
    const url = AuthHelper.createForgotPasswordUrl(token);
    await sendEmail(user.email, url)

    return true;
  }

  public signToken(id: number) {
    const payload: JwtDto = { userId: id };

    return this.jwtService.sign(payload);
  }

  public async validateUser(userId: number) {
    return this.userModel.findOne({ _id: userId });
  }
}
