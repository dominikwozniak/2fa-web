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
import { AuthForgotChangePasswordInput } from './dto/auth-forgot-change-password.input';
import { AuthVerifyInput } from './dto/auth-verify.input';
import { UserChangeEmailInput } from './dto/user-change-email.input';
import { UserUpdateInput } from './dto/user-update.input';
import { UserChangePasswordInput } from './dto/user-change-password.input';
import { CtxUser } from './decorators/ctx-user.decorator';
import { User } from '@/user/models/user.schema';
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
    @CtxUser() user: User,
    @Args({ name: 'input', type: () => UserChangePasswordInput })
    input: UserChangePasswordInput,
  ) {
    return this.authService.changePassword(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => QrCode)
  changeAuthenticationDevice(@CtxUser() user: User) {
    return this.authService.changeAuthenticationDevice(user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  updateProfile(
    @CtxUser() user: User,
    @Args({ name: 'input', type: () => UserUpdateInput })
    input: UserUpdateInput,
  ) {
    return this.authService.updateUserProfile(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  changeEmail(
    @CtxUser() user: User,
    @Args({ name: 'input', type: () => UserChangeEmailInput })
    input: UserChangeEmailInput,
  ) {
    return this.authService.changeEmail(user, input);
  }
}
