const bcrypt = require('bcrypt');
const { models } = require('../models');
const Account = models.account_employees;

const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    Account.findOne({
      where: {
        username: username
      },
      raw: true
    })
      .then(async function (user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const match = await validPassword(user, password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  }
));

passport.serializeUser(function(user, done) {
<<<<<<< HEAD
  done(null, {accountid: user.accountid, employeeid: user.employeeid, name: user.username, avatar: user.avatar});
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

async function validPassword(user, password) {
  return await bcrypt.compare(password, user.password); 
=======
    done(null, {id: user.accountid, name: user.username});
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

function validPassword(user, password) {
    return user.password===password;
>>>>>>> 1d37f491d84203b9cd1be91684b147b5c80e80f0
}

module.exports = passport;