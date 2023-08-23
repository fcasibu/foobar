import passport from 'passport';
import {
    Strategy as GoogleStrategy,
    type StrategyOptions as GoogleStrategyOptions,
} from 'passport-google-oauth2';
import {
    Strategy as GithubStrategy,
    type StrategyOptions as GithubStrategyOptions,
} from 'passport-github2';
import { User as UserModel } from 'lib';

export const toSnakeCase = (str: string) =>
    str.toLowerCase().replace(/\s/gi, '_');

export class PassportService {
    private readonly passport: typeof passport;

    constructor(private readonly User: typeof UserModel) {
        this.passport = passport;
    }

    public init() {
        this.passport.serializeUser((user, done) => {
            process.nextTick(() => {
                done(null, user);
            });
        });

        this.passport.deserializeUser((user: Express.User, done) => {
            process.nextTick(() => {
                done(null, user);
            });
        });

        this.passport.use(this.githubAuth());
        this.passport.use(this.googleAuth());
    }

    private githubAuth(
        options: GithubStrategyOptions = {
            clientID: process.env.PASSPORT_GITHUB_CLIENT_ID,
            clientSecret: process.env.PASSPORT_GITHUB_SECRET,
            callbackURL: process.env.PASSPORT_GITHUB_CALLBACK_URL,
        },
    ) {
        return new GithubStrategy(
            options,
            // eslint-disable-next-line
            // @ts-ignore
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await this.User.findOne({
                        auth_provider: profile.provider,
                        auth_id: profile.id,
                    })
                        .populate('rooms', 'name _id')
                        .exec();

                    if (user) {
                        return done(null, user);
                    }

                    const newUser = new this.User({
                        auth_provider: profile.provider,
                        auth_id: profile.id,
                        displayName: toSnakeCase(profile.displayName),
                    });

                    await newUser.save();

                    return done(null, newUser);
                } catch (e) {
                    return done(e, false);
                }
            },
        );
    }

    private googleAuth(
        options: GoogleStrategyOptions = {
            clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
            clientSecret: process.env.PASSPORT_GOOGLE_SECRET,
            callbackURL: process.env.PASSPORT_GOOGLE_CALLBACK_URL,
        },
    ) {
        return new GoogleStrategy(
            options,
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await this.User.findOne({
                        auth_provider: profile.provider,
                        auth_id: profile.id,
                    })
                        .populate('rooms', 'name _id')
                        .exec();

                    if (user) {
                        return done(null, user);
                    }

                    const newUser = new this.User({
                        auth_provider: profile.provider,
                        auth_id: profile.id,
                        displayName: toSnakeCase(profile.displayName),
                    });

                    await newUser.save();

                    return done(null, newUser);
                } catch (e) {
                    return done(e, false);
                }
            },
        );
    }
}
