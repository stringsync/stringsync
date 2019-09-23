import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: number;
  iat: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

const getJwt = (userId: number, issuedAt: Date): string => {
  const payload: JwtPayload = {
    id: userId,
    iat: issuedAt.getTime(),
  };
  return jwt.sign(payload, JWT_SECRET);
};

export default getJwt;
