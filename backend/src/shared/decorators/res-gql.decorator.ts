import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const ResGql = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Request => {
    const context = GqlExecutionContext.create(ctx).getContext();
    return context.res
  }
);
