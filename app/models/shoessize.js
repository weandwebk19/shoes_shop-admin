const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoessize', {
    productid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'products',
        key: 'productid'
      }
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'shoessize',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "shoessize_pkey",
        unique: true,
        fields: [
          { name: "productid" },
          { name: "size" },
        ]
      },
    ]
  });
};
