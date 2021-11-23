const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customers', {
    customerid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(2048),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "customers_pkey",
        unique: true,
        fields: [
          { name: "customerid" },
        ]
      },
    ]
  });
};
