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
import { UserLogin } from './models/user-login';
import { AuthRegisterInput } from './dto/auth-register.input';
import { AuthHelper } from './auth.helper';
import { JwtDto } from './dto/jwt.dto';
import { AuthConfirmInput } from './dto/auth-confirm.input';
import { sendEmail } from '../shared/sendEmail';
import { RedisService } from '../redis/redis.service';
import { AuthForgotPasswordInput } from './dto/auth-forgot-password.input';
import {
  confirmUserPrefix,
  forgotPasswordPrefix,
} from '../shared/consts/redisPrefixed.const';
import { AuthForgotChangePasswordInput } from './dto/auth-forgot-change-password.input';
import { generateQr } from '../shared/generateQr';
import { twoFactorGenerateSecret } from '../shared/twoFactorGenerateSecret';
import { AuthVerifyInput } from './dto/auth-verify.input';
import { twoFactorVerify } from '../shared/twoFactorVerify';
import { QrCode } from './models/qr-code';
import { UserUpdateInput } from './dto/user-update.input';
import { UserChangePasswordInput } from './dto/user-change-password.input';
import { UserChangeEmailInput } from './dto/user-change-email.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  public async login(input: AuthLoginInput): Promise<UserLogin> {
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

    if (found.twoFactorEnabled) {
      const { otpauth_url, base32 } = twoFactorGenerateSecret();

      if (!found.twoFactorToken) {
        found.twoFactorToken = base32;
        await found.save();

        return {
          qrUrl: await generateQr(otpauth_url),
        };
      }

      return {
        useAuthenticator: true,
      };
    }

    return {
      user: found,
      token: this.signToken(found.id),
    };
  }

  public async whoAmI(userInput: User): Promise<UserToken> {
    const user = await this.userModel.findOne({ email: userInput.email });

    if (!user) {
      throw new NotFoundException(
        `User with email ${userInput.email} does not exist`,
      );
    }

    return {
      user,
      token: this.signToken(user.id),
    };
  }

  public async verifyLogin(input: AuthVerifyInput): Promise<UserToken> {
    const user = await this.userModel.findOne({ email: input.email });

    if (!user) {
      throw new NotFoundException(
        `User with email ${input.email} does not exist`,
      );
    }

    if (!user.twoFactorToken) {
      throw new BadRequestException('Base token is not valid');
    }

    const verified = twoFactorVerify(user.twoFactorToken, input.token);

    if (!verified) {
      throw new BadRequestException('User is not verified');
    }

    return {
      user,
      token: this.signToken(user.id),
    };
  }

  public async register(input: AuthRegisterInput): Promise<Boolean> {
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

    return true;
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

  public async forgotPassword(
    input: AuthForgotPasswordInput,
  ): Promise<Boolean> {
    const user = await this.userModel.findOne({ email: input.email });

    if (!user) {
      return false;
    }

    const token = nanoid(32);
    const saveToken = forgotPasswordPrefix + token;
    const url = AuthHelper.createForgotPasswordUrl(token);
    await sendEmail(user.email, url);
    await this.redisService.setValue(saveToken, user._id);

    return true;
  }

  public async forgotPasswordChangePassword(
    input: AuthForgotChangePasswordInput,
  ): Promise<Boolean> {
    const token = forgotPasswordPrefix + input.token;
    const userId = await this.redisService.getValue(token);

    if (!userId) {
      return false;
    }

    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      return false;
    }

    await this.redisService.delete(token);
    const hashedPassword = await AuthHelper.hashPassword(input.password);

    user.password = hashedPassword;
    await user.save();

    return true;
  }

  public async changeAuthenticationDevice(userInput: User): Promise<QrCode> {
    const user = await this.userModel.findOne({ email: userInput.email });

    if (!user) {
      throw new BadRequestException(
        `Cannot find user with email ${userInput.email}`,
      );
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException(
        `${user.email} is not using two factor authentication`,
      );
    }

    const { otpauth_url, base32 } = twoFactorGenerateSecret();
    user.twoFactorToken = base32;
    await user.save();

    return {
      qrUrl: await generateQr(otpauth_url),
    };
  }

  public async changePassword(userInput: User, input: UserChangePasswordInput) {
    const user = await this.userModel.findOne({ email: userInput.email });

    if (!user) {
      return false;
    }

    const passwordValid = await AuthHelper.validatePassword(
      input.oldPassword,
      user.password,
    );

    if (!passwordValid) {
      return false;
    }

    user.password = await AuthHelper.hashPassword(input.newPassword);
    await user.save();

    return true;
  }

  public async updateUserProfile(userInput: User, input: UserUpdateInput) {
    const user = await this.userModel.findOne({ email: userInput.email });

    if (!user) {
      return false;
    }

    await user.update({ ...input });

    return true;
  }

  public async changeEmail(userInput: User, input: UserChangeEmailInput) {
    const user = await this.userModel.findOne({ email: userInput.email });
    const isReservedEmail = await this.userModel.findOne({ email: input.email });

    if (!user || isReservedEmail) {
      return false;
    }

    const passwordValid = await AuthHelper.validatePassword(
      input.password,
      user.password,
    );

    if (!passwordValid) {
      return false;
    }

    user.email = input.email;
    await user.save();

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
