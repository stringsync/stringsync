import { CsrfTokenPayload } from './types';

export const DUMMY_PAYLOAD: Readonly<CsrfTokenPayload> = Object.freeze({
  session: '',
  iat: new Date(),
});
