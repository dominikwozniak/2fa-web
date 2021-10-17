import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img from '@/public/assets/synchronize.svg';
import ProtectedRoute from '@/templates/ProtectedRoute';
import MainTemplate from '@/templates/MainTemplate';
import withApollo from '@/lib/withApollo';
import {
  namedOperations,
  useUpdateProfileMutation,
  useWhoAmIQuery,
} from '../generated';
import { popupNotification } from '@/utils/popup-notification';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { ChangeTwoFactor } from '@/types/change-two-factor.types';

const TwoFactor: React.FC = () => {
  const { data } = useWhoAmIQuery();
  const [updateProfile, { loading }] = useUpdateProfileMutation({
    onCompleted({ updateProfile }) {
      if (updateProfile) {
        popupNotification('Settings was updated');
      } else {
        popupNotification('Cannot update settings');
      }
    },
    onError(err) {
      popupNotification(`Error! ${err.message}`);
    },
    refetchQueries: [namedOperations.Query.WhoAmI],
  });

  const { handleSubmit, register, reset } = useForm<ChangeTwoFactor>({
    defaultValues: {
      twoFactorEnabled: data?.WhoAmI.user.twoFactorEnabled || false,
    },
  });

  const onSubmit = useCallback(
    async (form: ChangeTwoFactor) => {
      try {
        await updateProfile({
          variables: {
            twoFactorEnabled: form.twoFactorEnabled,
          },
        });
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  useEffect(() => {
    if (data?.WhoAmI.user.twoFactorEnabled) {
      reset({
        twoFactorEnabled: data?.WhoAmI.user.twoFactorEnabled,
      });
    }
  }, [data]);

  return (
    <ProtectedRoute>
      <MainTemplate title={'Two factor settings'}>
        <div className="is-flex is-flex-direction-column is-align-items-center two-factor">
          <div className="is-flex is-flex-direction-column is-align-items-center two-factor__header">
            <Image
              src={img}
              alt={'Confirm account banner image'}
              width={250}
              height={250}
            />
            <h3>Two-factor settings</h3>
          </div>
          <form
            className="columns p-4 mt-4 is-flex is-flex-direction-column is-align-items-left two-factor__content"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="column p-0 mt-2 two-factor__checkbox">
              <label className="checkbox is-flex is-align-items-center">
                <input type="checkbox" {...register('twoFactorEnabled')} />
                Enable two-factor authentication
              </label>
            </div>
            <Link href={'/dashboard'}>
              <a className="mt-4 is-flex is-flex-direction-row is-justify-content-flex-end">
                Back to dashboard
              </a>
            </Link>
            <div className="column p-0 mt-4 is-flex is-flex-direction-row is-justify-content-space-between two-factor__input">
              <button type="button" className="button is-primary">
                Change device
              </button>
              <button
                className={`button is-primary ${loading ? 'is-loading' : ''}`}
                type="submit"
                disabled={loading}
              >
                Save!
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </MainTemplate>
    </ProtectedRoute>
  );
};

export default withApollo(TwoFactor);
