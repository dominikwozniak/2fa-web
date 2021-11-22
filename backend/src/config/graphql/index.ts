import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      context: ({ req, res }) => ({ req, res }),
      autoSchemaFile: 'src/schema.gql',
      cors: {
        origin: [
          'http://localhost:3000',
          'https://frontend-authela-deploy.vercel.app/',
          'https://frontend-authela-deploy.vercel.app'
        ],
        credentials: true,
      },
      debug: true,
      introspection: true,
      playground: true,
      installSubscriptionHandlers: true,
    };
  }
}
