const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account_customers', {
    accountid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      defaultValue: "1234"
    },
    customerid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'customerid'
      }
    },
    avatar: {
      type: DataTypes.STRING(2048),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'account_customers',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "account_customers_pkey",
        unique: true,
        fields: [
          { name: "accountid" },
        ]
      },
    ]
  });
};
