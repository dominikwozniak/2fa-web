import React from 'react';
import { IconType } from '@/types/icon.types';
import EditImg from '../../public/assets/pen.svg';
import ChangePasswordImg from '../../public/assets/lock.svg';
import TwoFactorImg from '../../public/assets/bookmark.svg';

interface Props {
  icon: IconType;
  text: string;
}

const ActionButton: React.FC<Props> = ({ icon, text }) => {
  return (
    <button className="is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-space-between button is-primary action-button">
      <div className="is-flex is-align-items-center is-justify-content-center is-full action-button__icon">
        {icon === IconType.pen && <EditImg width={40} height={40} />}
        {icon === IconType.lock && <ChangePasswordImg width={40} height={40} />}
        {icon === IconType.bookmark && <TwoFactorImg width={40} height={40} />}
      </div>
      <p>{text}</p>
    </button>
  );
};

export default ActionButton;
