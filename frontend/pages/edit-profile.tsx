import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import ProtectedRoute from '@/templates/ProtectedRoute';
import MainTemplate from '@/templates/MainTemplate';
import { ToastContainer } from 'react-toastify';
import {
  namedOperations,
  useUpdateProfileMutation,
  useWhoAmIQuery,
} from '../generated';
import withApollo from '@/lib/withApollo';
import { popupNotification } from '@/utils/popup-notification';
import img from '@/public/assets/placeholder.png';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { ChangeNamePayload } from '@/types/change-name.types';
import Link from 'next/link';
import ChangePhotoButton from '@/components/ChangePhotoButton';

const EditProfile: React.FC = () => {
  const { data } = useWhoAmIQuery();
  const [updateProfile, { loading }] = useUpdateProfileMutation({
    onCompleted({ updateProfile }) {
      if (updateProfile) {
        popupNotification('Profile was updated');
      } else {
        popupNotification('Cannot update profile');
      }
    },
    onError(err) {
      popupNotification(`Error! ${err.message}`);
    },
    refetchQueries: [namedOperations.Query.WhoAmI],
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ChangeNamePayload>({
    defaultValues: {
      firstName: data?.WhoAmI.user.firstName || '',
      lastName: data?.WhoAmI.user.lastName || '',
    },
  });

  const onSubmit = useCallback(
    async (form: ChangeNamePayload) => {
      try {
        await updateProfile({
          variables: {
            firstName: form.firstName,
            lastName: form.lastName,
          },
        });
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  const handleChangeEmail = () => {
    Router.push('/change-email');
  };

  useEffect(() => {
    if (data?.WhoAmI.user.firstName && data.WhoAmI.user.lastName) {
      reset({
        firstName: data?.WhoAmI.user.firstName,
        lastName: data.WhoAmI.user.lastName,
      });
    }
  }, [data]);

  return (
    <ProtectedRoute>
      <MainTemplate title={'Edit profile'}>
        <div className="is-flex is-flex-direction-column is-align-items-center edit-profile">
          <div className="edit-profile__image">
            <Image
              src={img}
              alt={'Avatar'}
              width={128}
              height={128}
              objectFit={'fill'}
            />
          </div>
          <form
            className="columns py-4 is-flex is-flex-direction-column is-align-items-center edit-profile__content"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="p-0 mb-4 is-flex is-flex-direction-column is-align-items-center edit-profile__input">
              <ChangePhotoButton />
            </div>
            <div className="column p-0 is-flex is-flex-direction-column edit-profile__input">
              {errors.firstName && <ErrorInputIcon />}
              <span>First name</span>
              <input
                type="text"
                aria-invalid={errors.firstName ? 'true' : 'false'}
                placeholder="First name"
                {...register('firstName', {
                  required: true,
                  minLength: 2,
                })}
              />
            </div>
            <div className="column p-0 is-flex is-flex-direction-column edit-profile__input">
              {errors.lastName && <ErrorInputIcon />}
              <span>Last name</span>
              <input
                type="text"
                aria-invalid={errors.lastName ? 'true' : 'false'}
                placeholder="Last name"
                {...register('lastName', {
                  required: true,
                  minLength: 2,
                })}
              />
            </div>
            <div className="column p-0 edit-profile__input">
              <Link href={'/dashboard'}>
                <a className="is-flex is-flex-direction-row is-justify-content-flex-end">
                  Back to dashboard
                </a>
              </Link>
            </div>
            <div className="column p-0 mt-4 is-flex is-flex-direction-row is-justify-content-space-between edit-profile__input">
              <button
                type="button"
                className="button is-primary"
                onClick={handleChangeEmail}
              >
                Change e-mail
              </button>
              <button
                className={`button is-primary ${loading ? 'is-loading' : ''}`}
                type="submit"
                disabled={loading}
              >
                Save profile!
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </MainTemplate>
    </ProtectedRoute>
  );
};

export default withApollo(EditProfile);
