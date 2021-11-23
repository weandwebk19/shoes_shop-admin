const { models } = require('../models');

const findEmployeeInAccount = (id) => {
    return models.account_employees.findOne({
        where: {
            employeeid: id
        },
        raw: true
    })
}

const findEmployeeInListEmployee = (id) => {
    return models.employees.findOne({
        where: {
            employeeid: id
        },
        raw: true
    })
}

const findAccountByEmployeeid = (id) => {
    return models.account_employees.findOne({
        where: {
            employeeid: id
        },
        raw: true
    })
}

const listAccount = () => {
    return models.account_employees.findAll({ 
        //raw: true,
        attributes: [
            'username', 'password', 'employeeid',
        ],
        include: [
            {model: models.employees, as: 'employee', attributes:['employeeid', 'name','email', 'phone']}
        ],
    });
}

exports.list = async (req, res) => {
    const account_employees = await listAccount();
    res.render('account_employees/account_employee', { account_employees: JSON.parse(JSON.stringify(account_employees)) });
}

// [GET] /account_employee/create
exports.create = (req, res) => {
    res.render('account_employees/create-account_employee');
}

// [POST] /account_employee/store
exports.store = async (req, res, next) => {
    try {
        const employeeInList = await findEmployeeInListEmployee(req.body.employeeid);
        if (employeeInList) {
            const employee = await findEmployeeInAccount(req.body.employeeid);

            if (!employee) {
                models.account_employees.create(req.body)
                    .then(() => {
                        res.redirect('/account_employee');
                    })
                    .catch(next);
            }
            else {
                res.render('error', {
                    message: 'Nhân viên này đã có tài khoản !!'
                })
            }
        }
        else {
            res.render('error', { message: 'Mã nhân viên không đúng! Vui lòng kiểm tra lại !!' })
        }
    }
    catch (error) {
        res.render('error', { message: 'Mã nhân viên không đúng! Vui lòng kiểm tra lại !!' })
    }
}

//[DELETE] /account_employee/:id
exports.delete = async (req, res, next) => {
    models.account_employees.destroy({
        where: { employeeid: req.params.id }
    })
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
}

//[GET] /account_employee/:id/edit
exports.edit = async (req, res) => {
    const account_employee = await findAccountByEmployeeid(req.params.id);
    res.render('account_employees/edit-account_employee', { account_employee });
}

//[PUT] /order/:id
exports.update = async (req, res, next) => {
    models.account_employees.update(req.body, {where: { employeeid: req.params.id}})
        .then(() => {
            res.redirect('/account_employee');
        })
        .catch(next);
}