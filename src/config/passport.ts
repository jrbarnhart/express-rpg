import passport from "passport";
import passportJWT, { StrategyOptions } from "passport-jwt";
import prisma from "../lib/prisma";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET || "",
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: payload.username },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
