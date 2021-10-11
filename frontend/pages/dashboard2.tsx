import React from 'react';
import ProtectedRoute from '@/templates/ProtectedRoute';
import Router from 'next/router';
import withApollo from "@/lib/withApollo";

const Dashboard2: React.FC = () => {
  return (
    <ProtectedRoute>
      dashboard{' '}
      <button onClick={() => Router.push('/dashboard')}>Dashboard</button>
    </ProtectedRoute>
  );
};

export default withApollo(Dashboard2);
