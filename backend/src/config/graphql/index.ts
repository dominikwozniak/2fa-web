import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      context: ({ req, res }) => ({ req, res }),
      autoSchemaFile: 'src/schema.gql',
      cors: false,
      debug: true,
      introspection: true,
      playground: true,
      installSubscriptionHandlers: true,
    };
  }
}
