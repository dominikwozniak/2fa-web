import { useApolloClient } from '@apollo/client';
import { useAuthToken } from '@/hooks/useAuthToken';
import Router from 'next/router';

export const useLogout = () => {
  const [, , removeAuthToken] = useAuthToken();
  const apolloClient = useApolloClient();

  return async () => {
    await apolloClient.clearStore();
    removeAuthToken();
    Router.push('/');
  };
};
