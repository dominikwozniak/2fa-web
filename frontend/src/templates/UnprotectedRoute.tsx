import React, { useEffect } from 'react';
import { useWhoAmIQuery } from '../../generated';
import Router from 'next/router';
import { useLogout } from '@/hooks/useLogout';
import { useAuthToken } from '@/hooks/useAuthToken';

interface Props {
  children: React.ReactNode;
}

const UnprotectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { loading, error, data } = useWhoAmIQuery({
    fetchPolicy: 'network-only',
    onCompleted() {
      // Router.push('/dashboard');
    },
  });
  const [, , removeAuthToken] = useAuthToken();
  const logout = useLogout();

  // useEffect(() => {
  //   removeAuthToken();
  // }, [])

  // TODO: replace with loader
  if (loading) {
    return <p>Loading...</p>;
  }

  console.log(loading, error?.message, data);

  if (!loading && error?.message) {
    return <>{children}</>;
  }

  if (!loading && !error?.message) {
    removeAuthToken();
    Router.push('/dashboard');
  }

  // return !data && error ? <>{children}</> : <p>Loading...</p>;
  return null;
};

export default UnprotectedRoute;
