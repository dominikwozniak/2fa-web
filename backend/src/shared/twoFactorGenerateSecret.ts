import * as speakeasy from 'speakeasy';

export const twoFactorGenerateSecret = () => {
  const { otpauth_url, base32 } = speakeasy.generateSecret({
    name: process.env.TFA_SECRET,
  });

  return {
    otpauth_url,
    base32,
  };
};
