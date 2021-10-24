import React from 'react';
import Image from 'next/image';
import { useAuthLogout } from '@/hooks/useAuthLogout';
import img from '../../public/assets/arrow-right.svg';

const LogoutButton: React.FC = () => {
  const logout = useAuthLogout();

  return (
    <button
      className="button is-light is-flex is-align-items-center"
      onClick={logout}
    >
      <Image src={img} alt={'Logout button'} width={24} height={24} />
    </button>
  );
};

export default LogoutButton;
