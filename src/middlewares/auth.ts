import { User } from "@/models/user";
import { isEmpty } from "lodash";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt as ExtractJwt } from "passport-jwt";


const opts = {
  "jwtFromRequest": ExtractJwt.fromAuthHeaderAsBearerToken(),
  "secretOrKey": process.env.SECRET_KEY
};

passport.use('local', new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const dataUserFromToken = jwt_payload.user;
    const user = await User.findOne({ where: { walletAddress: dataUserFromToken.walletAddress } });
    if (isEmpty(user)) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));
