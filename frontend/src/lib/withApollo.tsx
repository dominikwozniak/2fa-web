import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { useRouter } from 'next/router';
import nextWithApollo from 'next-with-apollo';
import { useAuthToken } from '@/utils/auth-cookie';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authMiddleware = (authToken: string) =>
  new ApolloLink((operation, forward) => {
    if (authToken) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
    }

    return forward(operation);
  });

const withApollo = nextWithApollo(
  ({ initialState, headers }) => {
    const [authToken] = useAuthToken();
    return new ApolloClient({
      ssrMode: typeof window === 'undefined',
      link: authMiddleware(authToken).concat(httpLink),
      headers: {
        ...(headers as Record<string, string>),
      },
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  {
    render: ({ Page, props }) => {
      const router = useRouter();
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} {...router} />
        </ApolloProvider>
      );
    },
  },
);

export default withApollo;
