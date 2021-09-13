import React from 'react';
import Link from 'next/link'

const Signup = () => {
  const onSubmit = () => {
    console.log('>>> FORM SUBMITTED >>>');
  };

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-center signup">
      <div className="signup__header">
        <h1>Sign up</h1>
        <h3>I’m glad that you are joing the group of users</h3>
      </div>
      <form
        className="columns mt-4 mb-0 mx-auto signup__form"
        onSubmit={onSubmit}
      >
        <input
          className="input"
          type="email"
          placeholder="E-mail"
        />
        <div className="is-flex is-justify-content-space-between">
          <input
            className="input half-width"
            type="text"
            placeholder="First name"
          />
          <input
            className="input half-width"
            type="text"
            placeholder="Second name"
          />
        </div>
        <input
          className="input"
          type="text"
          placeholder="E-mail"
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
        />
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
