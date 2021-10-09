import React from 'react';
import Link from 'next/link';

const Bio: React.FC = () => {
  return (
    <div className="p-3 is-flex is-flex-direction-column is-justify-content-space-between bio">
      <div className="bio__content">
        <span>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry...
        </span>
      </div>
      <Link href={'/'}>
        <a>Edit bio</a>
      </Link>
    </div>
  );
};

export default Bio;
