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
const passwordRouter = require('./password.js');
const homeRouter = require('./home.js');

const permissionMiddleware = require('../components/middlewares/PermissionMiddleware');
const sortMiddleware = require('../components/middlewares/SortMiddleware');
const AuthMiddleware = require('../components/middlewares/AuthMiddleware');

function route(app) {
      app.use(sortMiddleware); // sort middleware

      app.use('/login', loginRouter);
      app.use('/product', AuthMiddleware, productRouter);
      app.use('/shoessize',AuthMiddleware, shoessizeRouter);
      app.use('/employee',AuthMiddleware, permissionMiddleware, employeeRouter);
      app.use('/customer',AuthMiddleware, customerRouter);
      app.use('/order',AuthMiddleware, orderRouter);
      app.use('/account_employee',AuthMiddleware,permissionMiddleware, account_employeeRouter);
      app.use('/account_customer',AuthMiddleware, account_customerRouter);
      app.use('/feedback',AuthMiddleware, permissionMiddleware, feedbackRouter);

      app.use('/logout', AuthMiddleware, logoutRouter);
      app.use('/profile',AuthMiddleware, profileRouter);             
      app.use('/password-reset',passwordRouter);             
      app.use('/',AuthMiddleware, homeRouter);             
}

module.exports = route;
