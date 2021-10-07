import React from 'react';
import Router from 'next/router';
import { useWhoAmIQuery } from '../../generated';
import { useAuthToken } from '@/hooks/useAuthToken';

interface Props {
  children: React.ReactNode;
}

const UnprotectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { loading, error, data } = useWhoAmIQuery({
    fetchPolicy: 'network-only',
  });
  const [, , removeAuthToken] = useAuthToken();

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

  return null;
};

export default UnprotectedRoute;
