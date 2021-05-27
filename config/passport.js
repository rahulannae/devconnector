const passportJwt = require('passport-jwt');
const User = require('../models/User');
// or used as mongoose.model('users'). require('mongoose') for this
const keys = require('./keys');

const JwtStrategy = passportJwt.Strategy;
const ExtractfromJwt = passportJwt.ExtractJwt;

const options = {
    jwtFromRequest: ExtractfromJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.authenticationKey
};

module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (userPayload, done) => {
        User.findById(userPayload.id).then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));
};
