import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(ctx: ExecutionContext) {
    const context = GqlExecutionContext.create(ctx);
    return context.getContext().req;
  }
}
