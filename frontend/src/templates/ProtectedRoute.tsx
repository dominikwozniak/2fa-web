import React from 'react';
import Router from 'next/router';
import { useWhoAmIQuery } from '../../generated';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { loading, error } = useWhoAmIQuery({
    fetchPolicy: 'network-only',
  });

  // TODO: replace with loader
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && !error?.message) {
    return <>{children}</>;
  }

  if (!loading && error?.message) {
    Router.push('/');
  }

  return null;
};

export default ProtectedRoute;
