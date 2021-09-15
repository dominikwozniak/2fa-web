import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { UserSignInPayload } from '../types/user.types';
import ErrorInputIcon from '../components/ErrorInputIcon';
import { ToastContainer, toast } from 'react-toastify';
import { popupNotification } from '../utils/popup-notification';

const Signin = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserSignInPayload>();

  const onSubmit = useCallback(
    async (data: UserSignInPayload) => {
      try {
        console.log('sign up', data);
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  useEffect(() => {
    if (Object.keys(errors).length) {
      popupNotification('Error!');
    }
  }, [errors]);

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-center signin">
      <div className="signin__header">
        <h1>Sign in</h1>
        <h3>Welcome back! Let's go log in to the website</h3>
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
          className="column button is-primary is-flex mx-auto mt-3"
          type="submit"
        >
          Log in!
        </button>
        <div className="mt-3">
          <span>Don't you have an accountt? </span>
          <Link href="/signup">Let's sign up</Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signin;
