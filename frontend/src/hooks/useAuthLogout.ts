import { useApolloClient } from '@apollo/client';
import { useAuthToken } from '@/hooks/useAuthToken';

export const useLogout = () => {
  const [, , removeAuthToken] = useAuthToken();
  const apolloClient = useApolloClient();

  return async () => {
    await apolloClient.clearStore();
    removeAuthToken();
    window.location.href = '/';
  };
};
