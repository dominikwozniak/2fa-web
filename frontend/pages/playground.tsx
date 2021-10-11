import React from 'react';
import Header from '@/components/Header';
import Bio from '@/components/Bio';
import ActionMenu from '@/components/ActionMenu';
import MainTemplate from "@/templates/MainTemplate";

const Playground: React.FC = () => {
  return (
    <MainTemplate title={'Dashboard'}>
      <Header
        firstName={'Dominik'}
        lastName={'Wozniak'}
        email={'dominik@mail.com'}
      />
      <Bio />
      <ActionMenu />
    </MainTemplate>
  );
};

export default Playground;
