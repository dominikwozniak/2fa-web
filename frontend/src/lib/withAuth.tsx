import { ComponentType } from 'react';
import { useWhoAmIQuery } from '../../generated';
import Loader from '@/components/Loader';
import Router from 'next/router';

export function withAuth<T>(Component: ComponentType<T>) {
  return (hocProps: T) => {
    const { loading, error } = useWhoAmIQuery({
      fetchPolicy: 'network-only',
    });

    if (loading) {
      return <Loader />;
    }

    if (!loading && !error?.message) {
      return <Component {...hocProps} />;
    }

    if (!loading && error?.message) {
      Router.push('/');
    }

    return <Loader/>
  };
}
