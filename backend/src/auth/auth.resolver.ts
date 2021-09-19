import { Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  async LifeCheck() {
    return 'Life check'
  }
}
