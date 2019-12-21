export const getUserAgent = (): string => {
  return 'userAgent' in navigator ? navigator.userAgent : '';
};
