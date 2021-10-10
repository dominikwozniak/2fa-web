import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IconType } from '@/types/icon.types';
import editImg from '@/public/assets/pen.svg';
import changePasswordImg from '@/public/assets/lock.svg';
import twoFactorImg from '@/public/assets/bookmark.svg';

interface Props {
  icon: IconType;
  text: string;
  link: string;
}

const ActionButton: React.FC<Props> = ({ icon, text, link }) => {
  return (
    <Link href={link}>
      <button className="is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-space-between button is-primary action-button">
        <div className="is-flex is-align-items-center is-justify-content-center is-full action-button__icon">
          {icon === IconType.pen && (
            <Image
              src={editImg}
              alt={'Edit icon image'}
              width={40}
              height={40}
            />
          )}
          {icon === IconType.lock && (
            <Image
              src={changePasswordImg}
              alt={'Change password icon image'}
              width={40}
              height={40}
            />
          )}
          {icon === IconType.bookmark && (
            <Image
              src={twoFactorImg}
              alt={'Two factor icon image'}
              width={40}
              height={40}
            />
          )}
        </div>
        <p>{text}</p>
      </button>
    </Link>
  );
};

export default ActionButton;
