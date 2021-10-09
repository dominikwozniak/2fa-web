import React from 'react';
import Router from 'next/router';
import withApollo from '@/lib/withApollo';
import ProtectedRoute from '@/templates/ProtectedRoute';
import MainTemplate from '@/templates/MainTemplate';
import Header from '@/components/Header';
import { useLogout } from '@/hooks/useLogout';
import Bio from '@/components/Bio';
import ActionMenu from '@/components/ActionMenu';
import LogoutButton from "@/components/LogoutButton";

const Dashboard: React.FC = () => {
  const logout = useLogout();

  return (
    <ProtectedRoute>
      <MainTemplate title={'Dashboard'}>
        <div className=" is-flex is-flex-direction-column is-align-items-center dashboard">
          <div>

          </div>
          <div>
            <Header
              firstName={'Dominik'}
              lastName={'Wozniak'}
              email={'dominik@mail.com'}
            />
          </div>
          <div className=" mt-4">
            <Bio />
          </div>
          <div className=" mt-5">
            <ActionMenu />
          </div>
        </div>
      </MainTemplate>
    </ProtectedRoute>
  );
};

export default withApollo(Dashboard);
