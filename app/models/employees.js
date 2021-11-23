const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employees', {
    employeeid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    citizenid: {
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
    }
  }, {
    sequelize,
    tableName: 'employees',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "employees_pkey",
        unique: true,
        fields: [
          { name: "employeeid" },
        ]
      },
    ]
  });
};
