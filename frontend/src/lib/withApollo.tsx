import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { useRouter } from 'next/router';
import nextWithApollo from 'next-with-apollo';
import { BACKEND_URL } from '@/consts/apollo.const';

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  credentials: 'include'
});

const withApollo = nextWithApollo(
  ({ initialState, headers }) => {
    return new ApolloClient({
      ssrMode: typeof window === 'undefined',
      link: httpLink,
      headers: {
        ...(headers as Record<string, string>),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, *',
        Cookie: headers?.cookie ?? ''
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
