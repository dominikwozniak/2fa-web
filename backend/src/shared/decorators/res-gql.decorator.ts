import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

export const ResGql = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Response => {
    const context = GqlExecutionContext.create(ctx).getContext();
    return context.res
  }
);
