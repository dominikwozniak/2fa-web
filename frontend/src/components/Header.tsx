import React from 'react';
import Image from 'next/image';
import img from '../../public/assets/placeholder.png';

interface Props {
  firstName: string;
  lastName: string;
  email: string;
}

const Header: React.FC<Props> = ({ firstName, lastName, email }) => {
  return (
    <div className="is-flex is-flex-direction-row is-align-items-center header">
      <div className="header__image">
        <Image
          src={img}
          alt={'Avatar'}
          width={128}
          height={128}
          objectFit={'fill'}
        />
      </div>
      <div className="pl-4 pt-4 header__content">
        <h1>Your profile</h1>
        <h3>{firstName} {lastName}</h3>
        <h4>{email}</h4>
      </div>
    </div>
  );
};

export default Header;
