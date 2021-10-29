import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { sessionUserId } from '@/shared/consts/session.const';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const context = GqlExecutionContext.create(ctx);
    const req: Request = context.getContext().req;

    return !!(req.session && req.session[sessionUserId]);
  }
}
