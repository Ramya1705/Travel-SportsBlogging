const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
                password: Math.random().toString(36).slice(-8), // Random password
                isVerified: true, // Auto-verify Google users
            };

            try {
                // Check if user exists by googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists by email (linked manually before)
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    user.googleId = profile.id;
                    user.isVerified = true;
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                user = await User.create(newUser);
                return done(null, user);
            } catch (err) {
                console.error('Error in GoogleStrategy:', err);
                return done(err, null);
            }
        }
    )
);
