import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserToken } from './models/user-token';
import { UserLogin } from './models/user-login';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthRegisterInput } from './dto/auth-register.input';
import { GqlAuthGuard } from './guards/gql-auth.guard'; // TODO: remove
import { AuthGuard } from '@/auth/guards/auth.guard';
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
import { ReqGql } from '@/shared/decorators/req-gql.decorator';
import { UserIdGql } from '@/shared/decorators/user-id-gql.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Query(() => UserToken)
  WhoAmI(@UserIdGql() userId: string) {
    return this.authService.whoAmI(userId);
  }

  @Mutation(() => UserLogin, { nullable: true })
  login(
    @Args({ name: 'input', type: () => AuthLoginInput }) input: AuthLoginInput,
    @ReqGql() req: Request,
  ) {
    return this.authService.login(input, req);
  }

  @Mutation(() => UserToken)
  verifyLogin(
    @Args({ name: 'input', type: () => AuthVerifyInput })
    input: AuthVerifyInput,
    @ReqGql() req: Request,
  ) {
    return this.authService.verifyLogin(input, req);
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

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  changePassword(
    @UserIdGql() userId: string,
    @Args({ name: 'input', type: () => UserChangePasswordInput })
    input: UserChangePasswordInput,
  ) {
    return this.authService.changePassword(userId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QrCode)
  changeAuthenticationDevice(@UserIdGql() userId: string) {
    return this.authService.changeAuthenticationDevice(userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  updateProfile(
    @UserIdGql() userId: string,
    @Args({ name: 'input', type: () => UserUpdateInput })
    input: UserUpdateInput,
  ) {
    return this.authService.updateUserProfile(userId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  changeEmail(
    @UserIdGql() userId: string,
    @Args({ name: 'input', type: () => UserChangeEmailInput })
    input: UserChangeEmailInput,
  ) {
    return this.authService.changeEmail(userId, input);
  }

  @Mutation(() => Boolean)
  logout(@ResGql() res: Response, @ReqGql() req: Request) {
    return this.authService.logout(res, req);
  }
}
