import React from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  children: React.ReactNode;
}

const MainTemplate: React.FC<Props> = ({ title, children }: Props) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Authela` : 'Authela'}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default MainTemplate;
