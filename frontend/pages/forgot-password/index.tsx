import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainTemplate from '@/templates/MainTemplate';
import { useForm } from 'react-hook-form';
import { ForgotPasswordPayload } from '@/types/forgot-password.types';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { UserSignInPayload } from '@/types/user.types';
import { ToastContainer } from 'react-toastify';
import img from '@/public/assets/authentication_fsn5.svg';
import { useForgotPasswordMutation } from '../../generated';
import { popupNotification } from '@/utils/popup-notification';
import withApollo from '@/lib/withApollo';

const ForgotPassword: React.FC = () => {
  const [forgotPasswordMutation, { data, loading, error }] =
    useForgotPasswordMutation({
      onCompleted() {
        popupNotification('Success! Email was sent');
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
  } = useForm<ForgotPasswordPayload>();

  const onSubmit = useCallback(
    async (form: UserSignInPayload) => {
      try {
        await forgotPasswordMutation({
          variables: {
            email: form.email,
          },
        });
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  return (
    <MainTemplate title={'Forgot password'}>
      <div className="is-flex is-flex-direction-column is-align-items-center forgot">
        <div className="is-flex is-flex-direction-column is-align-items-center forgot__header">
          <Image
            src={img}
            alt={'Confirm account banner image'}
            width={250}
            height={250}
          />
          <h3>Forgot password?</h3>
          <h4>
            to reset your password, please enter an email to which a link
            confirming your identity will be sent
          </h4>
        </div>
        <form
          className="columns mt-4 mb-0 mx-auto is-flex is-flex-direction-column forgot__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="column p-0">
            {errors.email && <ErrorInputIcon />}
            <input
              type="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              placeholder="E-mail"
              {...register('email', {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'invalid email address',
                },
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
            Send e-mail
          </button>
          <Link href="/">
            <a className="is-flex is-flex-direction-row is-justify-content-flex-end mt-4">
              Back to home
            </a>
          </Link>
        </form>
        <ToastContainer />
      </div>
    </MainTemplate>
  );
};

export default withApollo(ForgotPassword);
