import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserToken } from './models/user-token';
import { UserLogin } from './models/user-login';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthRegisterInput } from './dto/auth-register.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthConfirmInput } from './dto/auth-confirm.input';
import { AuthForgotPasswordInput } from './dto/auth-forgot-password.input';
import { AuthForgotChangePasswordInput } from './dto/auth-forgot-change-password.input';
import { AuthVerifyInput } from './dto/auth-verify.input';
import { UserChangeEmailInput } from './dto/user-change-email.input';
import { UserUpdateInput } from './dto/user-update.input';
import { UserChangePasswordInput } from './dto/user-change-password.input';
import { QrCode } from './models/qr-code';
import { UserGql } from '@/shared/decorators/user-gql.decorator';
import { ResGql } from '@/shared/decorators/res-gql.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserToken)
  WhoAmI(@UserGql() email: string) {
    return this.authService.whoAmI(email);
  }

  @Mutation(() => UserLogin, { nullable: true })
  login(
    @Args({ name: 'input', type: () => AuthLoginInput }) input: AuthLoginInput,
    @ResGql() res: Response,
  ) {
    return this.authService.login(input, res);
  }

  @Mutation(() => UserToken)
  verifyLogin(
    @Args({ name: 'input', type: () => AuthVerifyInput })
    input: AuthVerifyInput,
    @ResGql() res: Response,
  ) {
    return this.authService.verifyLogin(input, res);
  }

  @Mutation(() => Boolean)
  confirmAccount(
    @Args({ name: 'input', type: () => AuthConfirmInput })
    input: AuthConfirmInput,
  ) {
    return this.authService.confirmAccount(input);
  }

  @Mutation(() => Boolean)
  registerUser(
    @Args({ name: 'input', type: () => AuthRegisterInput })
    input: AuthRegisterInput,
  ) {
    return this.authService.register(input);
  }

  @Mutation(() => Boolean)
  forgotPassword(
    @Args({ name: 'input', type: () => AuthForgotPasswordInput })
    input: AuthForgotPasswordInput,
  ) {
    return this.authService.forgotPassword(input);
  }

  @Mutation(() => Boolean)
  forgotPasswordChangePassword(
    @Args({ name: 'input', type: () => AuthForgotChangePasswordInput })
    input: AuthForgotChangePasswordInput,
  ) {
    return this.authService.forgotPasswordChangePassword(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  changePassword(
    @UserGql() userEmail: string,
    @Args({ name: 'input', type: () => UserChangePasswordInput })
    input: UserChangePasswordInput,
  ) {
    return this.authService.changePassword(userEmail, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => QrCode)
  changeAuthenticationDevice(@UserGql() userEmail: string) {
    return this.authService.changeAuthenticationDevice(userEmail);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  updateProfile(
    @UserGql() userEmail: string,
    @Args({ name: 'input', type: () => UserUpdateInput })
    input: UserUpdateInput,
  ) {
    return this.authService.updateUserProfile(userEmail, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  changeEmail(
    @UserGql() userEmail: string,
    @Args({ name: 'input', type: () => UserChangeEmailInput })
    input: UserChangeEmailInput,
  ) {
    return this.authService.changeEmail(userEmail, input);
  }

  @Mutation(() => Boolean)
  logout(@ResGql() res: Response) {
    return this.authService.logout(res)
  }
}
