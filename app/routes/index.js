const productRouter = require('./product.js');
const shoessizeRouter = require('./shoessize.js');
const employeeRouter = require('./employee.js');
const customerRouter = require('./customer.js');
const orderRouter = require('./order.js');
const account_employeeRouter = require('./account_employee.js');
const account_customerRouter = require('./account_customer.js');
const reportRouter = require('./report.js');
const feedbackRouter = require('./feedback.js');
const mapsRouter = require('./maps.js');
const screenLockRouter = require('./screenLock.js');
const loginRouter = require('./login.js');
const registerRouter = require('./register.js');
const profileRouter = require('./profile.js');
const homeRouter = require('./home.js');

function route(app) {
      
      app.use('/product', productRouter);
      app.use('/shoessize', shoessizeRouter);
      app.use('/employee', employeeRouter);
      app.use('/customer', customerRouter);
      app.use('/order', orderRouter);
      app.use('/account_employee', account_employeeRouter);
      app.use('/account_customer', account_customerRouter);
      app.use('/report', reportRouter);
      app.use('/feedback', feedbackRouter);
      app.use('/maps', mapsRouter);
      app.use('/screenLock', screenLockRouter);
      app.use('/login', loginRouter);
      app.use('/register', registerRouter);
      app.use('/profile', profileRouter);             
      app.use('/', homeRouter);             
}

module.exports = route;
