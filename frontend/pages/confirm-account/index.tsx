import React from 'react';
import MainTemplate from '@/templates/MainTemplate';
import Image from 'next/image';
import Link from 'next/link';
import img from '@/public/assets/support.svg';

const ConfirmAccount: React.FC = () => {
  return (
    <MainTemplate title={'Confirm account'}>
      <div className="is-flex is-flex-direction-column is-align-items-center confirm">
        <Image
          src={img}
          alt={'Confirm account banner image'}
          width={250}
          height={250}
        />
        <h3 className="mt-4">Thanks for create account!</h3>
        <h4 className="mt-2">
          To activate your account, click on the link in the e-mail that was
          sent to your address.
        </h4>
        <Link href={'/'}>
          <button className="button is-primary is-block my-4">
            Back to home
          </button>
        </Link>
      </div>
    </MainTemplate>
  );
};

export default ConfirmAccount;
