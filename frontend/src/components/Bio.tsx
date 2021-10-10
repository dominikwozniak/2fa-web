import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import ErrorInputIcon from '@/components/ErrorInputIcon';
import { useForm } from 'react-hook-form';
import { EditBioPayload } from '@/types/edit-bio.types';
import {
  namedOperations,
  useUpdateProfileMutation,
  WhoAmIQuery,
} from '../../generated';
import { popupNotification } from '@/utils/popup-notification';

interface Props {
  text?: string;
}

const Bio: React.FC<Props> = ({ text }) => {
  const [active, setActive] = useState(false);

  const [updateProfile, { data, loading }] = useUpdateProfileMutation({
    onCompleted({ updateProfile }) {
      if (updateProfile) {
        popupNotification('Bio was changed');
      } else {
        popupNotification('Cannot change bio');
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
  } = useForm<EditBioPayload>();

  const handleChangeActive = () => {
    setActive((current) => !current);
  };

  const onSubmit = useCallback(
    async (form: EditBioPayload) => {
      try {
        await updateProfile({
          variables: {
            bio: form.bio,
          },
        });
        handleChangeActive();
      } catch (err) {
        console.error('error', err);
      }
    },
    [reset],
  );

  return (
    <div className="p-3 is-flex is-flex-direction-column is-justify-content-space-between bio">
      <div className="bio__content">
        <span>{text ? text : 'You have not provided a bio yet!'}</span>
      </div>
      <div className="bio__edit" onClick={handleChangeActive}>
        Edit bio
      </div>
      <div className={`modal ${active ? 'is-active' : ''} bio__modal`}>
        <div className="modal-background" />
        <div className="modal-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <header className="modal-card-head">
              <p className="modal-card-title">Edit bio</p>
              <button
                className="delete"
                aria-label="close"
                type="button"
                onClick={handleChangeActive}
              />
            </header>
            <section className="modal-card-body">
              <div className="column p-0">
                {errors.bio && <ErrorInputIcon />}
                <textarea
                  aria-invalid={errors.bio ? 'true' : 'false'}
                  placeholder="Your new bio..."
                  {...register('bio', {
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
    </div>
  );
};

export default Bio;
