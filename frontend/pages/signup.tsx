import React, { useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Router from 'next/router';
import MainTemplate from '@/templates/MainTemplate';
import img from '@/public/assets/phone_data.svg';
import { UserSignUpPayload } from '@/types/user.types';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { useRegisterMutation } from '../generated';
import { ToastContainer } from 'react-toastify';
import { popupNotification } from '@/utils/popup-notification';
import withApollo from '@/lib/withApollo';
import UnprotectedRoute from '@/templates/UnprotectedRoute';

const Signup: React.FC = () => {
  const [registerMutation, { data, loading }] = useRegisterMutation({
    onCompleted({ registerUser }) {
      if (registerUser) {
        popupNotification(
          'Successfully registered! Please check your email to confirm account'
        );
        setTimeout(() => Router.push('/'), 4000);
      }
    },
    onError(err) {
      popupNotification(`Error! ${err.message}`);
    }
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserSignUpPayload>();

  const onSubmit = useCallback(
    async (form: UserSignUpPayload) => {
      try {
        await registerMutation({
          variables: {
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            twoFactorEnabled: form.twoFactorEnabled,
          },
        });
      } catch (err) {
        console.error('register error', err);
        popupNotification(`Cannot register user with ${form.email}`);
      }
    },
    [reset, data, registerMutation],
  );

  return (
    <UnprotectedRoute>
      <MainTemplate title={'Sign up'}>
        <div className="is-flex is-flex-direction-column signup">
          <div className="is-flex is-flex-direction-column is-justify-content-center signup__header">
            <Image src={img} alt={'Signup banner image'} width={200} />
            <h1>Sign up</h1>
            <h4>I’m glad that you are joing the group of users</h4>
          </div>
          <form
            className="columns mt-4 mb-0 mx-auto is-flex is-flex-direction-column signup__form"
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
            <div className="column p-0 is-flex is-justify-content-space-between">
              <div className="half-column">
                {errors.firstName && <ErrorInputIcon />}
                <input
                  type="text"
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  placeholder="First name"
                  {...register('firstName', {
                    required: true,
                    maxLength: 30,
                    minLength: 2,
                  })}
                />
              </div>
              <div className="half-column">
                {errors.lastName && <ErrorInputIcon />}
                <input
                  type="text"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  placeholder="Last name"
                  {...register('lastName', {
                    required: true,
                    maxLength: 30,
                    minLength: 2,
                  })}
                />
              </div>
            </div>
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
            <div className="column p-0">
              <label className="checkbox is-flex is-align-items-center">
                <input type="checkbox" {...register('twoFactorEnabled')} />
                Use two-factor authentication
              </label>
            </div>
            <button
              className={`column button is-primary is-flex mx-auto mt-3 ${
                loading ? 'is-loading' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              Create an account!
            </button>
            <div className="my-3">
              <span>Do you have an account? </span>
              <Link href="/signin">Let&apos;s sign in</Link>
            </div>
          </form>
        </div>
        <ToastContainer />
      </MainTemplate>
    </UnprotectedRoute>
  );
};

export default withApollo(Signup);
