const accountEmployeeService = require('../services/Account_employeeService');

module.exports = async function PermissionMiddleware(req, res, next) {
    const account = await accountEmployeeService.findAccountById(req.user.accountid);
    if (account && account.type === 'admin') {
        next();
    }
    else {
        res.render('error', { message: 'Bạn không có quyền truy cập tính năng này!', suggest: ' Đăng nhập với quyền admin để sử dụng tính năng.'});
    }
}