import * as speakeasy from 'speakeasy';

export const twoFactorGenerateSecret = () => {
  const { otpauth_url, base32 } = speakeasy.generateSecret({
    name: 'Secret key',
  });

  return {
    otpauth_url,
    base32,
  };
};
