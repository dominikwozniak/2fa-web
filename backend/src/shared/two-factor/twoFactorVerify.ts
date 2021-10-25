import * as speakeasy from 'speakeasy';

export const twoFactorVerify = (base32Token: string, token: string) => {
  return speakeasy.totp.verify({
    secret: base32Token,
    encoding: 'base32',
    token,
  });
};
