import React from 'react';
import { compose } from 'recompose';
import withAuth from '@/lib/withAuth';
import withApollo from '@/lib/withApollo';

const MyComponent = () => {
  return <div>test</div>;
};

export default compose(withApollo, withAuth)(MyComponent);
