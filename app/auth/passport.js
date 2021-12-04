const { models } = require('../models');
const Account = models.account_employees;

const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    Account.findOne({
        where: {
            username: username
        },
        raw: true
    })
        .then( function (user) {
          console.log(user);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!validPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
            })
        .catch((err)=> done(err));
  }
));

passport.serializeUser(function(user, done) {
    done(null, {id: user.accountid, name: user.username});
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

function validPassword(user, password) {
    return user.password===password;
}

module.exports = passport;