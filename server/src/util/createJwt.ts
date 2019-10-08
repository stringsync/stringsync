import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: number;
  iat: number; // issued at
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
export const JWT_COOKIE_NAME = 'ss:auth:jwt';

export const createJwt = (userId: number, issuedAt: Date): string => {
  const payload: JwtPayload = {
    id: userId,
    iat: issuedAt.getTime(),
  };
  return jwt.sign(payload, JWT_SECRET);
};
