import React from 'react';
import { useWhoAmIQuery } from '../../generated';
import Router from 'next/router';
import { useAuthToken } from '@/hooks/useAuthToken';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { loading, error, data } = useWhoAmIQuery();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    Router.push('/');
  }

  return data && !error ? <>{children}</> : <p>Loading...</p>;
};

export default ProtectedRoute;
