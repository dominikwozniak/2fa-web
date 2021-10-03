import React from 'react';
import Router from 'next/router';
import withApollo from '@/lib/withApollo';
import ProtectedRoute from '@/templates/ProtectedRoute';
import { useLogout } from '@/hooks/useLogout';

const Dashboard: React.FC = () => {
  const logout = useLogout();

  return (
    <ProtectedRoute>
      dashboard
      <button onClick={() => Router.push('/dashboard2')}>Dashboard 2</button>
      <button onClick={logout}>Logout</button>
    </ProtectedRoute>
  );
};

export default withApollo(Dashboard);
