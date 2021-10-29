import React from 'react';
import { withAuth } from '@/lib/withAuth';
import withApollo from '@/lib/withApollo';
import { compose } from 'recompose';

const MyComponent = () => {
  return <div>test</div>;
};

export default compose(withApollo, withAuth)(MyComponent);
