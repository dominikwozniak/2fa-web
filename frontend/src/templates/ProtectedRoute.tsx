import React from 'react';
import Router from 'next/router';
import { useWhoAmIQuery } from '../../generated';
import Loader from '@/components/Loader';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { loading, error } = useWhoAmIQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Loader />;
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
