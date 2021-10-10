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

const EditProfile: React.FC = () => {
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
      <MainTemplate title={'Edit profile'}>
        <div className="is-flex is-flex-direction-column is-align-items-center edit-profile">

          <ToastContainer />
        </div>
      </MainTemplate>
    </ProtectedRoute>
  );
};

export default withApollo(EditProfile);
