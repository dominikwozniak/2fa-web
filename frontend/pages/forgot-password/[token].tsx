import React, { useCallback } from 'react';
import MainTemplate from '@/templates/MainTemplate';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ForgotChangePasswordPayload } from '@/types/forgot-password.types';
import { UserSignInPayload } from '@/types/user.types';

const ForgotPasswordToken: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ForgotChangePasswordPayload>();

  const onSubmit = useCallback(
    async (form: UserSignInPayload) => {
      try {
        await loginMutation({
          variables: {
            password: form.password,
          },
        });
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
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
          <Link href="/">
            <a className="is-flex is-flex-direction-row is-justify-content-flex-end mt-4">
              Back to home
            </a>
          </Link>
        </form>
      </div>
    </MainTemplate>
  );
};

export default ForgotPasswordToken;
