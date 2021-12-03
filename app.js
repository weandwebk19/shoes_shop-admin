const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const route = require('./app/routes');
const { sequelize } = require('./app/models');
const session = require('express-session');
const passport = require('./app/auth/passport');

const app = express();

// Connect to Db
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(() => {
    console.error('Unable to connect to the database:', error);
    exit(1);
  })

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({ secret: "cats" }));

app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.engine('.hbs', exphbs({ extname: '.hbs',
  helpers: {
    mul: (a, b) => a * b,
    sum: (a, b) => a + b,
}
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

//Route init
route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;