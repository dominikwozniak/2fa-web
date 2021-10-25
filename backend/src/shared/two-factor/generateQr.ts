import { toDataURL } from 'qrcode';

export const generateQr = async (text: string) => {
  try {
    return await toDataURL(text);
  } catch (err) {
    console.error(err);
  }
};
