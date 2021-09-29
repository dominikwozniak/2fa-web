import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserToken } from './models/user-token';
import { UserLogin } from './models/user-login';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthRegisterInput } from './dto/auth-register.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthConfirmInput } from './dto/auth-confirm.input';
import { AuthForgotPasswordInput } from './dto/auth-forgot-password.input';
import { AuthChangePasswordInput } from './dto/auth-change-password.input';
import { AuthVerifyInput } from './dto/auth-verify.input';
import { CtxUser } from './decorators/ctx-user.decorator';
import { User } from './models/user.schema';
import { QrCode } from './models/qr-code';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserToken)
  WhoAmI(@CtxUser() user: User) {
    return this.authService.whoAmI(user);
  }

  @Mutation(() => UserLogin, { nullable: true })
  login(
    @Args({ name: 'input', type: () => AuthLoginInput }) input: AuthLoginInput,
  ) {
    return this.authService.login(input);
  }

  @Mutation(() => UserToken)
  verifyLogin(
    @Args({ name: 'input', type: () => AuthVerifyInput })
    input: AuthVerifyInput,
  ) {
    return this.authService.verifyLogin(input);
  }

  @Mutation(() => Boolean)
  confirmAccount(
    @Args({ name: 'input', type: () => AuthConfirmInput })
    input: AuthConfirmInput,
  ) {
    return this.authService.confirmAccount(input);
  }

  @Mutation(() => UserToken)
  register(
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

  @Mutation(() => UserToken)
  changePassword(
    @Args({ name: 'input', type: () => AuthChangePasswordInput })
    input: AuthChangePasswordInput,
  ) {
    return this.authService.changePassword(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => QrCode)
  changeAuthenticationDevice(@CtxUser() user: User) {
    return this.authService.changeAuthenticationDevice(user);
  }
}
