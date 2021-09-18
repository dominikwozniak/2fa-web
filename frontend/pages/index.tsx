import React from 'react';
import Head from 'next/head';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <a className="button is-primary">
          Button1
        </a>

        <a className="button is-primary">
          Button2
        </a>
      </main>
    </div>
  );
}

export default Home;
