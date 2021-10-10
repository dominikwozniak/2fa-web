import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Router from "next/router";
import ProtectedRoute from '@/templates/ProtectedRoute';
import MainTemplate from '@/templates/MainTemplate';
import img from '@/public/assets/authentication_fsn5.svg';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { ToastContainer } from 'react-toastify';
import { useChangePasswordMutation } from '../generated';
import { useForm } from 'react-hook-form';
import { ChangePasswordPayload } from '@/types/change-password.types';
import withApollo from '@/lib/withApollo';
import { popupNotification } from "@/utils/popup-notification";

const ChangePassword: React.FC = () => {
  const [changePasswordMutation, { loading, data }] =
    useChangePasswordMutation({
      onCompleted(changePasswordMutation) {
        if (changePasswordMutation) {
          Router.push('/dashboard')
        } else {
          popupNotification('Error! Cannot change password.');
        }
      },
      onError(err) {
        popupNotification(`Error! ${err.message}`);
      },
    });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordPayload>();

  const onSubmit = useCallback(
    async (form: ChangePasswordPayload) => {
      try {
        await changePasswordMutation({
          variables: {
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
          },
        });
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  return (
    <ProtectedRoute>
      <MainTemplate title={'Change password'}>
        <div className="is-flex is-flex-direction-column is-align-items-center change-password">
          <div className="is-flex is-flex-direction-column is-align-items-center change-password__header">
            <Image
              src={img}
              alt={'Confirm account banner image'}
              width={250}
              height={250}
            />
            <h3>Change password</h3>
          </div>
          <form
            className="columns mt-4 mb-0 mx-auto is-flex is-flex-direction-column change-password__form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="column p-0">
              {errors.oldPassword && <ErrorInputIcon />}
              <input
                type="password"
                aria-invalid={errors.oldPassword ? 'true' : 'false'}
                placeholder="Your current password"
                {...register('oldPassword', {
                  required: true,
                })}
              />
            </div>
            <div className="column p-0">
              {errors.newPassword && <ErrorInputIcon />}
              <input
                type="password"
                aria-invalid={errors.oldPassword ? 'true' : 'false'}
                placeholder="Your new password"
                {...register('newPassword', {
                  required: true,
                  minLength: 7,
                  maxLength: 99,
                })}
              />
            </div>
            <button
              className={`column button is-primary is-flex mx-auto mt-3 ${
                loading ? 'is-loading' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              Change password
            </button>
            <Link href="/dashboard">
              <a className="is-flex is-flex-direction-row is-justify-content-flex-end mt-4">
                Back to dashboard
              </a>
            </Link>
          </form>
          <ToastContainer />
        </div>
      </MainTemplate>
    </ProtectedRoute>
  );
};

export default withApollo(ChangePassword);
