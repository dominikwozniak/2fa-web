import React from 'react';
import Router from 'next/router';
import { useWhoAmIQuery } from '../../generated';
import Loader from '@/components/Loader';

interface Props {
  children: React.ReactNode;
}

const UnprotectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { loading, error } = useWhoAmIQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Loader />;
  }

  if (!loading && error?.message) {
    return <>{children}</>;
  }

  if (!loading && !error?.message) {
    Router.push('/dashboard');
  }

  return <Loader />;
};

export default UnprotectedRoute;
