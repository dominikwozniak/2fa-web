import React from 'react';
import ActionButton from '@/components/ActionButton';

const ActionMenu = () => {
  return (
    <div className="is-flex is-flex-direction-row is-justify-content-space-between action">
      <ActionButton text={'Edit profile'} />
      <ActionButton text={'Change password'} />
      <ActionButton text={'Enable 2FA'} />
    </div>
  );
};

export default ActionMenu;
