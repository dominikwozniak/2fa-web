import { useApolloClient } from '@apollo/client';
import { useLogoutMutation } from '../../generated';
import { ROUTE_HOME } from '@/consts/routes.const';

export const useAuthLogout = () => {
  const [logoutMutation] = useLogoutMutation();
  const apolloClient = useApolloClient();

  return async () => {
    await logoutMutation();
    await apolloClient.clearStore();
    window.location.href = ROUTE_HOME;
  };
};
