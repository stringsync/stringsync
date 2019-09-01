import { StringSync } from '@/types/string-sync';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { prisma } from '../prisma/generated/prisma-client';
import bcrypt from 'bcrypt';

export class AuthError extends Error {
  constructor() {
    super('invalid username or password');
  }
}

export class JwtError extends Error {
  constructor() {
    super('jwt expired');
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await prisma.user({ username });
        const passwordsMatch = await bcrypt.compare(
          password,
          user.encryptedPassword
        );
        if (passwordsMatch) {
          return done(null, user);
        }
        return done(new AuthError());
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req) => req.cookies.jwt,
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done(new JwtError());
      }
      return done(null, jwtPayload);
    }
  )
);

export const auth: StringSync.RequestHandler = passport.authenticate('jwt', {
  session: false,
});
