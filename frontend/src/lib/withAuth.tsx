import { ComponentType } from 'react';
import { useWhoAmIQuery } from '../../generated';
import Loader from '@/components/Loader';
import Router from 'next/router';
import { APOLLO_AUTH_FETCH_POLICY } from '@/consts/apollo.const';
import { ROUTE_HOME } from '@/consts/routes.const';

export default function withAuth<T>(Component: ComponentType<T>) {
  return (hocProps: T) => {
    const { loading, error } = useWhoAmIQuery({
      fetchPolicy: APOLLO_AUTH_FETCH_POLICY,
    });

    if (loading) {
      return <Loader />;
    }

    if (!loading && !error?.message) {
      return <Component {...hocProps} />;
    }

    if (!loading && error?.message) {
      Router.push(ROUTE_HOME);
    }

    return <Loader />;
  };
}
