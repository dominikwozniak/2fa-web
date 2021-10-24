import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserGql = createParamDecorator((data, ctx) => {
  const context = GqlExecutionContext.create(ctx).getContext();
  return context.req && context.req.user.email;
});
