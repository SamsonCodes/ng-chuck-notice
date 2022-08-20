const passport = require('passport');
module.exports.isAuth = passport.authenticate('jwt', {session: false});