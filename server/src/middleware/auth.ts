import { StringSync } from '@/types/string-sync';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { prisma } from '../prisma/generated/prisma-client';
import bcrypt from 'bcrypt';

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
        return done(new Error('incorrect username or password'));
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
        return done(new Error('jwt expired'));
      }
      return done(null, jwtPayload);
    }
  )
);

export const auth: StringSync.RequestHandler = (req, res, next) => {
  next();
};
