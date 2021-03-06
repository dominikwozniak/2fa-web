import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { compose } from 'recompose';
import withAuth from '@/lib/withAuth';
import withApollo from '@/lib/withApollo';
import img from '@/public/assets/synchronize.svg';
import MainTemplate from '@/templates/MainTemplate';
import {
  namedOperations,
  useChangeAuthenticationDeviceMutation,
  useUpdateProfileMutation,
  useWhoAmIQuery,
} from '../generated';
import { popupNotification } from '@/utils/popup-notification';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { ChangeTwoFactor } from '@/types/change-two-factor.types';
import QrModal from '@/components/QrModal';

const TwoFactor: React.FC = () => {
  const [activeQrModal, setActiveQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
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

  const [changeAuthenticationDeviceMutation, { loading: changeAuthLoading }] =
    useChangeAuthenticationDeviceMutation({
      onCompleted({ changeAuthenticationDevice }) {
        if (changeAuthenticationDevice.qrUrl) {
          popupNotification('Device was updated');
          setQrUrl(changeAuthenticationDevice.qrUrl);
          setActiveQrModal(true);
        } else {
          popupNotification('Cannot change device');
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

  const handleChangeDevice = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await changeAuthenticationDeviceMutation();
    } catch (err) {
      console.error('error', err);
    }
  };

  useEffect(() => {
    if (data?.WhoAmI.user.twoFactorEnabled) {
      reset({
        twoFactorEnabled: data?.WhoAmI.user.twoFactorEnabled,
      });
    }
  }, [data]);

  return (
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
            <button
              type="button"
              className={`button is-primary ${
                changeAuthLoading ? 'is-loading' : ''
              }`}
              onClick={handleChangeDevice}
              disabled={
                !data?.WhoAmI.user.twoFactorEnabled || changeAuthLoading
              }
            >
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
      <QrModal
        url={qrUrl}
        active={activeQrModal}
        setActive={setActiveQrModal}
      />
      <ToastContainer />
    </MainTemplate>
  );
};

export default compose(withApollo, withAuth)(TwoFactor);
