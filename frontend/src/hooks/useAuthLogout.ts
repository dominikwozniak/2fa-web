import { useApolloClient } from '@apollo/client';
import { useLogoutMutation } from '../../generated';

export const useAuthLogout = () => {
  const [logoutMutation] = useLogoutMutation();
  const apolloClient = useApolloClient();

  return async () => {
    await logoutMutation();
    await apolloClient.clearStore();
    window.location.href = '/';
  };
};
