import React from 'react';
import Image from 'next/image';
import img from '../../public/assets/camera.svg';
import { namedOperations, useUpdateProfileMutation } from '../../generated';
import { popupNotification } from '@/utils/popup-notification';
import { formatFilename } from '@/utils/format-filename';
import { checkImage } from '@/utils/check-image';

const BUCKET_URL =
  'https://file-upload-bucket-public.s3.eu-central-1.amazonaws.com';

const ChangePhotoButton: React.FC = () => {
  const [updateProfile, { loading }] = useUpdateProfileMutation({
    onCompleted({ updateProfile }) {
      if (updateProfile) {
        popupNotification('Image was updated');
      } else {
        popupNotification('Cannot update image');
      }
    },
    onError(err) {
      popupNotification(`Error! ${err.message}`);
    },
    refetchQueries: [namedOperations.Query.WhoAmI],
  });

  const onFileChange = async (event: any) => {
    const file = event.target.files[0];
    const formattedName = formatFilename(file.name);

    if (!checkImage(file.type)) {
      return;
    }

    const res = await fetch('/api/s3', {
      method: 'POST',
      body: JSON.stringify({
        type: file.type,
        name: formattedName,
      }),
    });
    const { url } = await res.json();

    const s3Res = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-type': file.type,
      },
    });

    if (s3Res.status === 200) {
      await updateProfile({
        variables: {
          image: `${BUCKET_URL}/${formattedName}`,
        },
      });
    }
  };

  return (
    <label
      htmlFor="image-upload"
      className="button is-white is-flex is-align-items-center change-photo"
    >
      <Image src={img} alt={'Change photo button'} width={24} height={24} />
      <input id="image-upload" type="file" onChange={onFileChange} disabled={loading} />
    </label>
  );
};

export default ChangePhotoButton;
