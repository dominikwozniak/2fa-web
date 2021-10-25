import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { sessionUserId } from '@/shared/consts/session.const';

export const UserIdGql = createParamDecorator((data, ctx) => {
  const context = GqlExecutionContext.create(ctx).getContext();
  return context.req && context.req.session[sessionUserId];
});
