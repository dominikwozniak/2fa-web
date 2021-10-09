import React, { useEffect } from 'react';
import withApollo from '@/lib/withApollo';
import ProtectedRoute from '@/templates/ProtectedRoute';
import MainTemplate from '@/templates/MainTemplate';
import Header from '@/components/Header';
import Bio from '@/components/Bio';
import ActionMenu from '@/components/ActionMenu';
import { useWhoAmIQuery } from '../generated';

const Dashboard: React.FC = () => {
  const { data } = useWhoAmIQuery();

  return (
    <ProtectedRoute>
      <MainTemplate title={'Dashboard'}>
        <div className=" is-flex is-flex-direction-column is-align-items-center dashboard">
          <div>
            {data?.WhoAmI.user &&
              data?.WhoAmI.user.firstName &&
              data?.WhoAmI.user.lastName && (
                <Header
                  firstName={data?.WhoAmI.user.firstName}
                  lastName={data?.WhoAmI.user.lastName}
                  email={data?.WhoAmI.user.email}
                />
              )}
          </div>
          <div className="mt-5">
            <Bio />
          </div>
          <div className="mt-5">
            <ActionMenu />
          </div>
        </div>
      </MainTemplate>
    </ProtectedRoute>
  );
};

export default withApollo(Dashboard);
