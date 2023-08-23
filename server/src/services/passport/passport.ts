import { User as UserModel } from 'lib';
import passport from 'passport';
import {
    Strategy as JWTStrategy,
    ExtractJwt,
    type StrategyOptions as JWTStrategyOptions,
} from 'passport-jwt';
import {
    Strategy as GoogleStrategy,
    type StrategyOptions as GoogleStrageyOptions,
} from 'passport-google-oauth2';

export class PassportService {
    private readonly passport: typeof passport;

    constructor(private readonly User: typeof UserModel) {
        this.passport = passport;
    }

    public init() {
        this.passport.use(this.jwtAuth());
        this.passport.use(this.googleAuth());
    }

    private jwtAuth(
        options: JWTStrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.PASSPORT_JWT_SECRET,
        },
    ) {
        return new JWTStrategy(options, async (payload, done) => {
            try {
                const user = await this.User.findById(payload.id).exec();

                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            } catch (e) {
                return done(e, false);
            }
        });
    }

    private googleAuth(
        options: GoogleStrageyOptions = {
            clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
            clientSecret: process.env.PASSPORT_GOOGLE_SECRET,
            callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
            passReqToCallback: true,
        },
    ) {
        return new GoogleStrategy(
            options,
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await this.User.findById(profile.id).exec();

                    if (user) {
                        return done(null, user);
                    }

                    const newUser = new this.User(
                        {
                            username: profile.displayName,
                            displayName: profile.displayName,
                        },
                        { _id: profile.id },
                    );

                    await newUser.save();

                    return done(null, newUser);
                } catch (e) {
                    return done(e, false);
                }
            },
        );
    }
}
