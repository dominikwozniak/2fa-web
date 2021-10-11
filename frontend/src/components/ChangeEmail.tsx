import React, { useCallback } from 'react';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { useForm } from 'react-hook-form';
import { ChangeEmailPayload } from '@/types/change-email.types';
import { namedOperations, useChangeEmailMutation } from '../../generated';
import { popupNotification } from '@/utils/popup-notification';

interface Props {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangeEmail: React.FC<Props> = ({ active, setActive }) => {
  const [changeEmail, { loading }] = useChangeEmailMutation({
    onCompleted({ changeEmail }) {
      if (changeEmail) {
        popupNotification('Email was changed');
        handleChangeActive();
      } else {
        popupNotification('Cannot change email');
      }
    },
    onError(err) {
      popupNotification(`Error! ${err.message}`);
    },
    refetchQueries: [namedOperations.Query.WhoAmI],
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ChangeEmailPayload>();

  const onSubmit = useCallback(
    async (form: ChangeEmailPayload) => {
      try {
        await changeEmail({
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

  const handleChangeActive = () => {
    setActive((current) => !current);
  };

  return (
    <div className={`modal ${active ? 'is-active' : ''} change-email`}>
      <div className="modal-background" />
      <div className="modal-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <header className="modal-card-head">
            <p className="modal-card-title">Change e-mail</p>
            <button
              className="delete"
              aria-label="close"
              type="button"
              onClick={handleChangeActive}
            />
          </header>
          <section className="modal-card-body">
            <div className="column p-0">
              {errors.email && <ErrorInputIcon />}
              <input
                aria-invalid={errors.email ? 'true' : 'false'}
                type="email"
                placeholder="Your new e-mail"
                {...register('email', {
                  required: true,
                })}
              />
            </div>
            <div className="column p-0">
              {errors.password && <ErrorInputIcon />}
              <input
                aria-invalid={errors.password ? 'true' : 'false'}
                type="password"
                placeholder="Your password"
                {...register('password', {
                  required: true,
                })}
              />
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className={`button is-primary ${loading ? 'is-loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              Save!
            </button>
            <button
              type="button"
              className="button"
              onClick={handleChangeActive}
            >
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmail;
