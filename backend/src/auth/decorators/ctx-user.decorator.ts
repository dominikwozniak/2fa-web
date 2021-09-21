import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CtxUser = createParamDecorator((data, ctx) => {
  const context = GqlExecutionContext.create(ctx).getContext();
  return context.req.user;
});
