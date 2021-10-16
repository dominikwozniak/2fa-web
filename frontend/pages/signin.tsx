import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import img from '@/public/assets/team_building.svg';
import MainTemplate from '@/templates/MainTemplate';
import { UserSignInPayload } from '@/types/user.types';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { popupNotification } from '@/utils/popup-notification';
import { useLoginMutation, useVerifyLoginMutation } from '../generated';
import { useAuthToken } from '@/hooks/useAuthToken';
import withApollo from '@/lib/withApollo';
import UnprotectedRoute from '@/templates/UnprotectedRoute';
import QrModal from '@/components/QrModal';

const Signin: React.FC = () => {
  const [activeQrModal, setActiveQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [, setAuthToken] = useAuthToken();
  const [loginMutation, { loading, data }] = useLoginMutation({
    onCompleted({ login }) {
      if (login?.token && !login?.authenticator && !login?.qrCode) {
        setAuthToken(login.token);
        window.location.href = '/dashboard';
      }

      if (!login?.token && login?.authenticator) {
        if (login?.qrUrl && login?.qrCode) {
          setQrUrl(login.qrUrl);
          setActiveQrModal(true);
        } else {
          console.log('SECOND LOGIN');
        }
      }
    },
    onError(err) {
      popupNotification(`Error! ${err.message}`);
    },
  });

  const [verifyLoginMutation, { loading: verifyLoading }] = useVerifyLoginMutation({
    onCompleted({ verifyLogin }) {
      if (verifyLogin.token) {
        setAuthToken(verifyLogin.token);
        window.location.href = '/dashboard';
      } else {
        popupNotification('Cannot authorize');
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
  } = useForm<UserSignInPayload>();

  const onSubmit = useCallback(
    async (form: UserSignInPayload) => {
      try {
        if (form.code) {
          console.log('CODE', form.code);
          await verifyLoginMutation({
            variables: {
              email: form.email,
              password: form.password,
              token: form.code,
            },
          });
        } else {
          await loginMutation({
            variables: {
              email: form.email,
              password: form.password,
            },
          });
        }
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  return (
    <UnprotectedRoute>
      <MainTemplate title={'Sign in'}>
        <div className="is-flex is-flex-direction-column signin">
          <div className="is-flex is-flex-direction-column is-justify-content-center signin__header">
            <Image src={img} alt={'Signin banner image'} width={250} />
            <h1>Sign in</h1>
            <h4>Welcome back! Let&apos;s go log in to the website</h4>
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
            {data?.login?.authenticator && (
              <div className="column p-0">
                {errors.code && <ErrorInputIcon />}
                <input
                  type="text"
                  aria-invalid={errors.code ? 'true' : 'false'}
                  placeholder="Authenticator code"
                  {...register('code', {
                    required: false,
                  })}
                />
              </div>
            )}
            {!data?.login?.authenticator && (
              <Link href="/forgot-password">
                <a className="is-flex is-flex-direction-row is-justify-content-flex-end">
                  Forgot password?
                </a>
              </Link>
            )}
            <button
              className={`column button is-primary is-flex mx-auto mt-3 ${
                loading || verifyLoading ? 'is-loading' : ''
              }`}
              type="submit"
              disabled={loading || verifyLoading}
            >
              {data?.login?.authenticator ? 'Authorize' : 'Log in!'}
            </button>
            <div className="my-3">
              <span>Don&apos;t you have an account? </span>
              <Link href="/signup">Let&apos;s sign up</Link>
            </div>
          </form>
          <QrModal
            url={qrUrl}
            active={activeQrModal}
            setActive={setActiveQrModal}
          />
          <ToastContainer />
        </div>
      </MainTemplate>
    </UnprotectedRoute>
  );
};

export default withApollo(Signin);
