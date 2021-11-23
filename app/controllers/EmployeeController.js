const { models } = require('../models');

const listEmployee = () => {
    return models.employees.findAll({ raw: true });
}

const findEmployeeById = (id) => {
    return models.employees.findOne({
        where: {
            employeeid: id
        },
        raw: true
    })
}

const findEmployeeByPhone = (phone) => {
    return models.employees.findOne({
        where: {
            phone: phone
        },
        raw: true
    })
}

exports.list = async (req, res) => {
    const employees = await listEmployee();
    res.render('employees/employee', { employees });
}

// [GET] /employee/create
exports.create = (req, res) => {
    res.render('employees/create-employee');
}

// [POST] /employee/store
exports.store = async (req, res, next) => {
    models.employees.create(req.body)
        .then(async () => {
            const employee = await findEmployeeByPhone(req.body.phone);

            const account = {
                username: employee.phone,
                email: employee.email,
                employeeid: employee.employeeid
            }
            models.account_employees.create(account)
                .then(() => { res.redirect('/employee') })
                .catch(() => { 
                    res.render('error', {
                    message: 'Số điện thoại đã tồn tại trong danh sách!'})
                });    
        })
        .catch (next);
}

//[DELETE] /employee/:id
exports.delete = async (req, res, next) => {
    //const employee = await findEmployeeById(req.params.id);

    models.account_employees.destroy({
        where: { employeeid: req.params.id }
    })
        .then(() => {
            models.employees.destroy({
                where: { employeeid: req.params.id }
            })
                .then(() => res.redirect('back'))
                .catch(next);
        })
        .catch(next);
}

//[GET] /employee/:id/edit
exports.edit = async (req, res) => {
    const employee = await findEmployeeById(req.params.id);
    res.render('employees/edit-employee', { employee });
}

//[PUT] /employee/:id
exports.update = (req, res, next) => {
    models.employees.update(req.body, {
        where: {
            employeeid: req.params.id
        }
    })
        .then(() => res.redirect('/employee'))
        .catch(next);
}