import React from 'react';

const Signup = () => {
  const onSubmit = () => {
    console.log('>>> FORM SUBMITTED >>>');
  };

  return (
    <div className="signup">
      <div className="signup__header">
        <h1>Sign up</h1>
        <h3>I’m glad that you are joing the group of users</h3>
      </div>
      <form
        className="columns my-0 mx-auto signup__form"
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
            type="email"
            placeholder="E-mail"
          />
          <input
            className="input half-width"
            type="email"
            placeholder="E-mail"
          />
        </div>
        <input
          className="input"
          type="email"
          placeholder="E-mail"
        />
        <input
          className="input"
          type="email"
          placeholder="E-mail"
        />
        <a
          className="is-flex is-flex-direction-row is-justify-content-flex-end"
          href="#"
        >Forgot password?</a>
        <button
          className="column button is-primary is-fullwidth is-flex"
          type="submit"
        >
          Create account!
        </button>
      </form>
      <div className="signup__already-signed">
        <span>Do you have an account?</span>
        <a href="#">Let's sign in</a>
      </div>
    </div>
  );
};

export default Signup;
