import React from 'react';
import MainTemplate from "@/templates/MainTemplate";

const Home: React.FC = () => {
  return (
    <MainTemplate title={'Home'}>
      <main>
        <a className="button is-primary">
          Button1
        </a>

        <a className="button is-primary">
          Button2
        </a>
      </main>
    </MainTemplate>
  );
}

export default Home;
