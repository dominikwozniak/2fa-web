import React from 'react';
import Image from 'next/image';
import Router from 'next/router';
import img from '../../public/assets/camera.svg';

const ChangePhotoButton: React.FC = () => {
  const handleClick = () => {
    Router.push('/change-photo');
  };

  return (
    <button
      className="button is-white is-flex is-align-items-center"
      onClick={handleClick}
    >
      <Image src={img} alt={'Change photo button'} width={24} height={24} />
    </button>
  );
};

export default ChangePhotoButton;
