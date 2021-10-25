import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

export const ReqGql = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Response => {
    const context = GqlExecutionContext.create(ctx).getContext();
    return context.req;
  },
);
