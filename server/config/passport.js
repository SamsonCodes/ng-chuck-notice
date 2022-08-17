const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
    usernameField: 'name',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {
    console.log(username);
    User.findOne({ name: username })
        .then((user) => {
            console.log('Found user');
            console.log(user);
            if (!user) { return done(null, false) }
            
            const isValid = validPassword(password, user.hash, user.salt);
            console.log(isValid)
            if (isValid) {
                console.log('login successful');
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {   
            done(err);
        });

}

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});