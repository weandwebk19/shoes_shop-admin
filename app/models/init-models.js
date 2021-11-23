var DataTypes = require("sequelize").DataTypes;
var _account_customers = require("./account_customers");
var _account_employees = require("./account_employees");
var _comments = require("./comments");
var _customers = require("./customers");
var _employees = require("./employees");
var _feedbacks = require("./feedbacks");
var _orders = require("./orders");
var _products = require("./products");
var _shoessize = require("./shoessize");
var _sliders = require("./sliders");

function initModels(sequelize) {
  var account_customers = _account_customers(sequelize, DataTypes);
  var account_employees = _account_employees(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);
  var customers = _customers(sequelize, DataTypes);
  var employees = _employees(sequelize, DataTypes);
  var feedbacks = _feedbacks(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var shoessize = _shoessize(sequelize, DataTypes);
  var sliders = _sliders(sequelize, DataTypes);

  comments.belongsTo(account_customers, { as: "account", foreignKey: "account_id"});
  account_customers.hasMany(comments, { as: "comments", foreignKey: "account_id"});
  account_customers.belongsTo(customers, { as: "customer", foreignKey: "customerid"});
  customers.hasMany(account_customers, { as: "account_customers", foreignKey: "customerid"});
  orders.belongsTo(customers, { as: "customer", foreignKey: "customerid"});
  customers.hasMany(orders, { as: "orders", foreignKey: "customerid"});
  account_employees.belongsTo(employees, { as: "employee", foreignKey: "employeeid"});
  employees.hasMany(account_employees, { as: "account_employees", foreignKey: "employeeid"});
  comments.belongsTo(products, { as: "product", foreignKey: "productid"});
  products.hasMany(comments, { as: "comments", foreignKey: "productid"});
  orders.belongsTo(products, { as: "product", foreignKey: "productid"});
  products.hasMany(orders, { as: "orders", foreignKey: "productid"});
  shoessize.belongsTo(products, { as: "product", foreignKey: "productid"});
  products.hasMany(shoessize, { as: "shoessizes", foreignKey: "productid"});

  return {
    account_customers,
    account_employees,
    comments,
    customers,
    employees,
    feedbacks,
    orders,
    products,
    shoessize,
    sliders,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
