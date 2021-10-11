import React, { useEffect } from 'react';
import MainTemplate from '@/templates/MainTemplate';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import img from '@/public/assets/accept.svg';
import withApollo from '@/lib/withApollo';
import { useConfirmUserMutation } from '../../generated';

const ConfirmAccountWithToken: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [confirmUserMutation, { data, loading }] = useConfirmUserMutation();

  useEffect(() => {
    async function confirm() {
      if (token) {
        const confirmToken = token.toString();
        await confirmUserMutation({
          variables: {
            token: confirmToken,
          },
        });
      }
    }
    confirm();
  }, [token]);

  return (
    <MainTemplate title={'Confirm account'}>
      <div className="is-flex is-flex-direction-column is-align-items-center confirm">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Image
              src={img}
              alt={'Confirm account banner image'}
              width={250}
              height={250}
            />
            <h3 className="mt-4">
              {data?.confirmAccount
                ? 'Your account has been activated'
                : 'Something went wrong'}
            </h3>
            <Link href={'/'}>
              <button className="button is-primary is-block my-4">
                Back to home
              </button>
            </Link>
            {data?.confirmAccount && (
              <Link href={'/signin'}>
                <button className="button is-primary is-block my-2">
                  Go to login page
                </button>
              </Link>
            )}
          </>
        )}
      </div>
    </MainTemplate>
  );
};

export default withApollo(ConfirmAccountWithToken);
