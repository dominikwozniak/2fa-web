import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { namedOperations, useDeleteUserMutation } from '../../generated';
import { popupNotification } from '@/utils/popup-notification';
import { DeleteProfilePayload } from '@/types/delete-profile.types';
import { ROUTE_HOME } from '@/consts/routes.const';

interface Props {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveAccount: React.FC<Props> = ({ active, setActive }) => {
  const [deleteUser, { loading }] = useDeleteUserMutation({
    onCompleted({ removeProfile }) {
      if (removeProfile) {
        window.location.href = ROUTE_HOME;
      } else {
        popupNotification('Cannot delete profile');
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
  } = useForm<DeleteProfilePayload>();

  const onSubmit = useCallback(
    async (form: DeleteProfilePayload) => {
      try {
        await deleteUser({
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

  const handleChangeActive = () => {
    setActive((current) => !current);
  };

  return (
    <div className={`modal ${active ? 'is-active' : ''} change-email`}>
      <div className="modal-background" />
      <div className="modal-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <header className="modal-card-head">
            <p className="modal-card-title">Delete account</p>
            <button
              className="delete"
              aria-label="close"
              type="button"
              onClick={handleChangeActive}
            />
          </header>
          <section className="modal-card-body">
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
              Remove
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

export default RemoveAccount;
