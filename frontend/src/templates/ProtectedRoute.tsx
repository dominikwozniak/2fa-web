import React from 'react';
import { useWhoAmIQuery } from '../../generated';
import Router from 'next/router';
import { useLogout } from '@/hooks/useLogout';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { loading, error, data } = useWhoAmIQuery({
    fetchPolicy: 'network-only',
  });
  const logout = useLogout();

  // TODO: replace with loader
  if (loading) {
    return <p>Loading...</p>;
  }

  // if (error && !loading && !data) {
  //   logout();
  //   Router.push('/');
  // }
  //
  // return data && !error ? <>{children}</> : <p>Loading...</p>;

  if (!loading && !error?.message) {
    return <>{children}</>;
  }

  if (!loading && error?.message) {
    Router.push('/');
  }

  return null;
};

export default ProtectedRoute;
