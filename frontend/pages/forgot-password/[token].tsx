import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainTemplate from '@/templates/MainTemplate';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { useForm } from 'react-hook-form';
import { ForgotChangePasswordPayload } from '@/types/forgot-password.types';
import { useForgotChangePasswordMutation } from '../../generated';
import { popupNotification } from '@/utils/popup-notification';
import { ToastContainer } from 'react-toastify';
import withApollo from '@/lib/withApollo';
import { ROUTE_HOME } from '@/consts/routes.const';

const ForgotPasswordToken: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [forgotChangePassword, { data, loading }] =
    useForgotChangePasswordMutation({
      onCompleted({ forgotPasswordChangePassword }) {
        if (forgotPasswordChangePassword) {
          window.location.href = ROUTE_HOME
        } else {
          popupNotification('Cannot change password');
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
  } = useForm<ForgotChangePasswordPayload>();

  const onSubmit = useCallback(
    async (form: ForgotChangePasswordPayload) => {
      try {
        await forgotChangePassword({
          variables: {
            token: token ? token.toString() : '',
            password: form.password,
          },
        });
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset, token],
  );

  return (
    <MainTemplate title={'Set new password'}>
      <div className="is-flex is-flex-direction-column is-align-items-center forgot">
        <div className="is-flex is-flex-direction-column is-align-items-center forgot__header">
          <h3>Forgot password?</h3>
          <h4>Now you can set new password below.</h4>
        </div>
        <form
          className="columns mt-4 mb-0 mx-auto is-flex is-flex-direction-column forgot__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="column p-0">
            {errors.password && <ErrorInputIcon />}
            <input
              type="password"
              aria-invalid={errors.password ? 'true' : 'false'}
              placeholder="Password"
              {...register('password', {
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
            Change password!
          </button>
          {(!loading || data) && (
            <Link href="/">
              <a className="is-flex is-flex-direction-row is-justify-content-flex-end mt-4">
                Back to home
              </a>
            </Link>
          )}
        </form>
        <ToastContainer />
      </div>
    </MainTemplate>
  );
};

export default withApollo(ForgotPasswordToken);
