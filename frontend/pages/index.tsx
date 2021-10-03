import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainTemplate from '@/templates/MainTemplate';
import img from '@/public/assets/sync_files.svg';

const Home: React.FC = () => {
  return (
    <MainTemplate title={'Home'}>
      <div className="is-fullwidth home">
        <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center home__header">
          <div className="mt-4 mb-3">
            <Image src={img} alt={'Header image'} width={200} height={200} />
          </div>
          <h1>Authela</h1>
          <h2>
            The Authela system is an easy-to-use, adaptable two-factor
            authentication solution.
          </h2>
        </div>
        <div className="is-flex is-flex-direction-column is-align-items-center home__content">
          <h3>Highly flexible and reusable.</h3>
          <h3>Try it now! You can also log into your account.</h3>
          <Link href={'signup'}>
            <button className="button is-primary is-block mb-4">
              Create an account!
            </button>
          </Link>
          <Link href={'/signin'}>
            <button className="button is-primary is-block mb-4">
              Log in to existing account!
            </button>
          </Link>
        </div>
      </div>
    </MainTemplate>
  );
};

export default Home;
