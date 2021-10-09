import React from 'react';
import Image from 'next/image';
import { useLogout } from '@/hooks/useLogout';
import img from '../../public/assets/arrow-right.svg';

const LogoutButton: React.FC = () => {
  const logout = useLogout();

  return (
    <button className="button is-light is-flex is-align-items-center logout-button" onClick={logout}>
      <Image src={img} alt={'Logout button'} width={24} height={24} />
    </button>
  );
};

export default LogoutButton;
