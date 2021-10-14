export const checkImage = (type: string) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  return acceptedImageTypes.includes(type);
};
