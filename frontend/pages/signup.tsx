import React, { useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { UserSignUpPayload } from '../types/user.types';
import ErrorInputIcon from '../components/ErrorInputIcon';

const Signup = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserSignUpPayload>();

  const onSubmit = useCallback(
    async (data: UserSignUpPayload) => {
      try {
        console.log('sign up', data);
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-center signup">
      <div className="signup__header">
        <h1>Sign up</h1>
        <h3>I’m glad that you are joing the group of users</h3>
      </div>
      <form
        className="columns mt-4 mb-0 mx-auto is-flex is-flex-direction-column signup__form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="column p-0">
          {errors.email && <ErrorInputIcon />}
          <input
            className="input is-primary"
            type="email"
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
              className="input is-primary"
              type="text"
              placeholder="First name"
              {...register('firstName', {
                required: true,
                maxLength: 30,
                minLength: 2,
              })}
            />
          </div>
          <div className="half-column">
            {errors.secondName && <ErrorInputIcon />}
            <input
              className="input is-primary"
              type="text"
              placeholder="Second name"
              {...register('secondName', {
                required: true,
                maxLength: 30,
                minLength: 2,
              })}
            />
          </div>
        </div>
        <div className="column p-0">
          {errors.username && <ErrorInputIcon />}
          <input
            className="input is-primary"
            type="text"
            placeholder="Username"
            {...register('username', {
              required: true,
              maxLength: 20,
              minLength: 5,
            })}
          />
        </div>
        <div className="column p-0">
          {errors.password && <ErrorInputIcon />}
          <input
            className="input is-primary"
            type="password"
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
          Create account!
        </button>
        <div className="mt-3 signup__form-already-signed">
          <span>Do you have an account? </span>
          <Link href="#">Let's sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
