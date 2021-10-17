import React from 'react';
import Image from 'next/image';
import img from '../../public/assets/avatar.svg';
import LogoutButton from '@/components/LogoutButton';
import { Maybe } from "../../generated";

interface Props {
  firstName: Maybe<string> | undefined;
  lastName: Maybe<string> | undefined;
  email: string;
  image: string;
}

const Header: React.FC<Props> = ({ firstName, lastName, email, image }) => {
  return (
    <div className="is-flex is-flex-direction-column header">
      <div className="is-flex is-justify-content-flex-end">
        <LogoutButton />
      </div>
      <div className="mt-2 is-flex is-flex-direction-row is-align-items-center">
        <div className="header__image">
          <Image
            src={image || img}
            alt={'Avatar'}
            width={128}
            height={128}
            objectFit={'fill'}
          />
        </div>
        <div className="pl-4 pt-4 header__content">
          <h1>Your profile</h1>
          {firstName && lastName && (
            <h3>
              {firstName} {lastName}
            </h3>
          )}
          <h4>{email}</h4>
        </div>
      </div>
    </div>
  );
};

export default Header;
