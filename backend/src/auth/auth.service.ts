import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { nanoid } from 'nanoid';
import { User } from '@/user/schema/user.schema';
import { UserService } from '@/user/user.service';
import { RedisService } from '@/redis/redis.service';
import { sendEmail } from '@/shared/mail/sendEmail';
import { createForgotPasswordUrl } from '@/shared/mail/create-forgot-password-url';
import { createConfirmUserUrl } from '@/shared/mail/create-confirm-user-url';
import { generateQr } from '@/shared/two-factor/generateQr';
import { twoFactorGenerateSecret } from '@/shared/two-factor/twoFactorGenerateSecret';
import { twoFactorVerify } from '@/shared/two-factor/twoFactorVerify';
import {
  confirmUserPrefix,
  forgotPasswordPrefix,
} from '@/shared/consts/redisPrefixes.const';
import { sessionUserId } from '@/shared/consts/session.const';
import { AuthLoginInput } from './dto/auth-login.input';
import { UserToken } from './models/user-token';
import { UserLogin } from './models/user-login';
import { AuthRegisterInput } from './dto/auth-register.input';
import { AuthHelper } from './auth.helper';
import { AuthConfirmInput } from './dto/auth-confirm.input';
import { AuthForgotPasswordInput } from './dto/auth-forgot-password.input';
import { AuthForgotChangePasswordInput } from './dto/auth-forgot-change-password.input';
import { AuthVerifyInput } from './dto/auth-verify.input';
import { QrCode } from './models/qr-code';
import { UserUpdateInput } from './dto/user-update.input';
import { UserChangePasswordInput } from './dto/user-change-password.input';
import { UserChangeEmailInput } from './dto/user-change-email.input';
import { UserRemoveInput } from '@/auth/dto/user-remove.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  public async login(input: AuthLoginInput, req: Request): Promise<UserLogin> {
    const found = await this.userService.findUserByEmailWithToken(input.email);

    // TODO: ask michal
    // found.tokenId.twoFactorToken = '';
    // await found.save();

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

      if (!found.tokenId.twoFactorToken || !found.afterFirstLogin) {
        // found.twoFactorToken = base32;
        // TODO: ask michal
        // found.tokenId.twoFactorToken = base32;
        // await found.save();

        // TODO: ask michal
        const token = await this.userService.findTokenById(found.tokenId._id)
        token.twoFactorToken = base32;
        await token.save();

        return {
          qrUrl: await generateQr(otpauth_url),
          qrCode: true,
          authenticator: true,
        };
      }

      return {
        authenticator: true,
        qrCode: false,
      };
    }

    req.session[sessionUserId] = found.id;

    return {
      user: found,
      authenticator: false,
      qrCode: false,
    };
  }

  public async whoAmI(userId: string): Promise<UserToken> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new GraphQLError('User does not exist');
    }

    return {
      user,
    };
  }

  public async verifyLogin(
    input: AuthVerifyInput,
    req: Request,
  ): Promise<UserToken> {
    const user = await this.userService.findUserByEmailWithToken(input.email);

    if (!user) {
      throw new GraphQLError('User does not exist');
    }

    if (!user.tokenId.twoFactorToken) {
      throw new BadRequestException('Base token is not valid');
    }

    const verified = twoFactorVerify(user.tokenId.twoFactorToken, input.token);

    if (!verified) {
      throw new BadRequestException('User is not verified');
    }

    user.afterFirstLogin = true;
    await user.save();

    req.session[sessionUserId] = user.id;

    return {
      user,
    };
  }

  public async register(input: AuthRegisterInput): Promise<Boolean> {
    const found = await this.userService.findUserByEmail(input.email);

    if (found) {
      throw new BadRequestException(
        `Cannot register with email ${input.email}`,
      );
    }

    const hashedPassword = await AuthHelper.hashPassword(input.password);

    const created = await this.userService.createUser(input, hashedPassword);

    if (created) {
      const token = nanoid(32);
      const saveToken = confirmUserPrefix + token;
      const url = createConfirmUserUrl(token);
      await sendEmail(created.email, url);
      await this.redisService.setValue(saveToken, created._id);
    }

    return true;
  }

  public async confirmAccount(input: AuthConfirmInput): Promise<Boolean> {
    const token = confirmUserPrefix + input.confirmToken;
    const userId = await this.redisService.getValue(token);
    const user = await this.userService.findUserById(userId);

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
    const user = await this.userService.findUserByEmail(input.email);

    if (!user) {
      return false;
    }

    const token = nanoid(32);
    const saveToken = forgotPasswordPrefix + token;
    const url = createForgotPasswordUrl(token);
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

    const user = await this.userService.findUserById(userId);

    if (!user) {
      return false;
    }

    await this.redisService.delete(token);
    const hashedPassword = await AuthHelper.hashPassword(input.password);

    user.password = hashedPassword;
    await user.save();

    return true;
  }

  public async changeAuthenticationDevice(userId: string): Promise<QrCode> {
    const user = await this.userService.findUserByIdWithToken(userId);

    if (!user) {
      throw new GraphQLError('Cannot find user with provided credentials');
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException(
        `${user.email} is not using two factor authentication`,
      );
    }

    const { otpauth_url, base32 } = twoFactorGenerateSecret();

    // TODO: ask michal
    user.tokenId.twoFactorToken = base32;
    await user.save();

    const token = await this.userService.findTokenById(user.tokenId._id)
    token.twoFactorToken = base32;
    await token.save();


    return {
      qrUrl: await generateQr(otpauth_url),
    };
  }

  public async changePassword(userId: string, input: UserChangePasswordInput) {
    const user = await this.userService.findUserById(userId);
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

  public async updateUserProfile(userId: string, input: UserUpdateInput) {
    const user = await this.userService.findUserByIdWithToken(userId);
    let twoFactorUpdateInput = {} as User;

    if (!user) {
      return false;
    }

    if (user.twoFactorEnabled && input.twoFactorEnabled === false) {
      const token = await this.userService.findTokenById(user.tokenId._id);
      twoFactorUpdateInput.afterFirstLogin = false;
      token.twoFactorToken = '';
      await token.save();
    }

    await user.updateOne({ ...input, ...twoFactorUpdateInput });

    return true;
  }

  public async changeEmail(userId: string, input: UserChangeEmailInput) {
    const user = await this.userService.findUserById(userId);
    const isReservedEmail = await this.userService.findUserByEmail(input.email);

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

  public async logout(res: Response, req: Request) {
    req.session.destroy(null);
    res.clearCookie('qid');

    return true;
  }

  public async removeProfile(
    res: Response,
    req: Request,
    userId: string,
    input: UserRemoveInput,
  ) {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new GraphQLError('User does not exist');
    }

    const passwordValid = await AuthHelper.validatePassword(
      input.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    await user.delete();
    await this.logout(res, req);

    return true;
  }
}
