import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserToken } from './models/user-token';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthRegisterInput } from './dto/auth-register.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthConfirmInput } from './dto/auth-confirm.input';
import { User } from './models/user.schema';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  hello() {
    return 'Hello world';
  }

  @Mutation(() => UserToken)
  login(
    @Args({ name: 'input', type: () => AuthLoginInput }) input: AuthLoginInput,
  ) {
    return this.authService.login(input);
  }

  @Mutation(() => User)
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
}
