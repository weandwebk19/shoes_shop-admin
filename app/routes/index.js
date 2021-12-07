const productRouter = require('./product.js');
const shoessizeRouter = require('./shoessize.js');
const employeeRouter = require('./employee.js');
const customerRouter = require('./customer.js');
const orderRouter = require('./order.js');
const account_employeeRouter = require('./account_employee.js');
const account_customerRouter = require('./account_customer.js');
const feedbackRouter = require('./feedback.js');
const mapsRouter = require('./maps.js');
const loginRouter = require('./login.js');
const logoutRouter = require('./logout.js');
<<<<<<< HEAD
=======
const registerRouter = require('./register.js');
>>>>>>> 1d37f491d84203b9cd1be91684b147b5c80e80f0
const profileRouter = require('./profile.js');
const homeRouter = require('./home.js');

function route(app) {
      app.use('/login', loginRouter);
      
      app.use(function (req, res, next) {
            if (req.user == null) {
                  res.redirect('/login');
            } else {
                  next();
            }
      });

      app.use('/product', productRouter);
      app.use('/shoessize', shoessizeRouter);
      app.use('/employee', employeeRouter);
      app.use('/customer', customerRouter);
      app.use('/order', orderRouter);
      app.use('/account_employee', account_employeeRouter);
      app.use('/account_customer', account_customerRouter);
      app.use('/feedback', feedbackRouter);
      app.use('/maps', mapsRouter);
<<<<<<< HEAD
      app.use('/logout', logoutRouter);
      app.use('/profile', profileRouter);
      app.use('/', homeRouter);

=======
      app.use('/screenLock', screenLockRouter);
      app.use('/login', loginRouter);
      app.use('/logout', logoutRouter);
      app.use('/register', registerRouter);
      app.use('/profile', profileRouter);             
      app.use('/', homeRouter);             
>>>>>>> 1d37f491d84203b9cd1be91684b147b5c80e80f0
}

module.exports = route;
