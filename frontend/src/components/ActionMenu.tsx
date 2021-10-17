import React from 'react';
import ActionButton from '@/components/ActionButton';
import { IconType } from '@/types/icon.types';

const ActionMenu = () => {
  return (
    <div className="is-flex is-flex-direction-row is-justify-content-space-between action">
      <ActionButton text={'Edit profile'} link={'/edit-profile'} icon={IconType.pen} />
      <ActionButton text={'Change password'} link={'/change-password'} icon={IconType.lock} />
      <ActionButton text={'Enable 2FA'} link={'/two-factor'} icon={IconType.bookmark} />
    </div>
  );
};

export default ActionMenu;
