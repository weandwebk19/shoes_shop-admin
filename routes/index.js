const productRouter = require('./product.js');
const employeeRouter = require('./employee.js');
const customerRouter = require('./customer.js');
const orderRouter = require('./order.js');
const accountRouter = require('./account.js');
const reportRouter = require('./report.js');
const mapsRouter = require('./maps.js');
const screenLockRouter = require('./screenLock.js');
const loginRouter = require('./login.js');
const registerRouter = require('./register.js');
const homeRouter = require('./home.js');

function route(app) {
      
      app.use('/product', productRouter);
      app.use('/employee', employeeRouter);
      app.use('/customer', customerRouter);
      app.use('/order', orderRouter);
      app.use('/account', accountRouter);
      app.use('/report', reportRouter);
      app.use('/maps', mapsRouter);
      app.use('/screenLock', screenLockRouter);
      app.use('/login', loginRouter);
      app.use('/register', registerRouter);
      app.use('/', homeRouter);             
}

module.exports = route;
