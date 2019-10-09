import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '.';

export interface JwtPayload {
  id: number;
  iat: number; // issued at
}

export const createAuthJwt = (userId: number, issuedAt: Date): string => {
  const payload: JwtPayload = {
    id: userId,
    iat: issuedAt.getTime(),
  };
  return jwt.sign(payload, JWT_SECRET);
};
