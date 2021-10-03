import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import img from '@/public/assets/team_building.svg';
import MainTemplate from '@/templates/MainTemplate';
import { UserSignInPayload } from '@/types/user.types';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { popupNotification } from '@/utils/popup-notification';
import { useLoginMutation, useWhoAmIQuery } from '../generated';
import { useAuthToken } from '@/hooks/useAuthToken';
import withApollo from '@/lib/withApollo';

const Signin: React.FC = () => {
  const [authToken, setAuthToken] = useAuthToken();
  const [loginMutation, { loading }] = useLoginMutation({
    onCompleted({ login }) {
      if (login?.token && !login?.useAuthenticator) {
        setAuthToken(login.token);
        window.location.href = '/dashboard';
      }
    },
    onError() {
      popupNotification('Error! Wrong credentials!');
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserSignInPayload>();

  const onSubmit = useCallback(
    async (form: UserSignInPayload) => {
      try {
        await loginMutation({
          variables: {
            email: form.email,
            password: form.password,
          },
        });
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  useEffect(() => {
    if (authToken) {
      Router.back();
    }
  }, []);

  if (authToken) {
    return <p>Loading...</p>
  }

  return (
    <MainTemplate title={'Sign in'}>
      <div className="is-flex is-flex-direction-column signin">
        <div className="is-flex is-flex-direction-column is-justify-content-center signin__header">
          <Image src={img} alt={'Signin banner image'} width={250} />
          <h1>Sign in</h1>
          <h4>Welcome back! Let's go log in to the website</h4>
        </div>
        <form
          className="columns mt-4 mb-0 mx-auto is-flex is-flex-direction-column signin__form"
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
          <Link href="#">
            <a className="is-flex is-flex-direction-row is-justify-content-flex-end">
              Forgot password?
            </a>
          </Link>
          <button
            className={`column button is-primary is-flex mx-auto mt-3 ${
              loading ? 'is-loading' : ''
            }`}
            type="submit"
          >
            Log in!
          </button>
          <div className="my-3">
            <span>Don't you have an account? </span>
            <Link href="/signup">Let's sign up</Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </MainTemplate>
  );
};

export default withApollo(Signin);
