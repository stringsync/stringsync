import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '.';

export interface JwtPayload {
  id: string;
  iat: number; // issued at
}

export const createAuthJwt = (userId: string, issuedAt: Date): string => {
  const payload: JwtPayload = {
    id: userId,
    iat: issuedAt.getTime(),
  };
  return jwt.sign(payload, JWT_SECRET);
};
