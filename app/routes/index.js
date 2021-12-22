const productRouter = require('./product.js');
const shoessizeRouter = require('./shoessize.js');
const employeeRouter = require('./employee.js');
const customerRouter = require('./customer.js');
const orderRouter = require('./order.js');
const account_employeeRouter = require('./account_employee.js');
const account_customerRouter = require('./account_customer.js');
const feedbackRouter = require('./feedback.js');
const loginRouter = require('./login.js');
const logoutRouter = require('./logout.js');
const profileRouter = require('./profile.js');
const homeRouter = require('./home.js');

const permissionMiddleware = require('../components/middlewares/PermissionMiddleware');
const sortMiddleware = require('../components/middlewares/SortMiddleware');

function route(app) {
      app.use(sortMiddleware); // sort middleware

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
      app.use('/employee', permissionMiddleware, employeeRouter);
      app.use('/customer', customerRouter);
      app.use('/order', orderRouter);
      app.use('/account_employee',permissionMiddleware, account_employeeRouter);
      app.use('/account_customer', account_customerRouter);
      app.use('/feedback', permissionMiddleware, feedbackRouter);

      app.use('/logout', logoutRouter);
      app.use('/profile', profileRouter);             
      app.use('/', homeRouter);             
}

module.exports = route;
